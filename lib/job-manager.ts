// Job manager for writing_jobs collection
// Handles CRUD operations and job state management

import type { Firestore, Timestamp as FirestoreTimestamp } from "firebase/firestore";
import {
  COLLECTIONS,
  type WritingJob,
  type CreateWritingJobInput,
  type JobProgressUpdate,
  type JobStatus,
} from "./firestore-schema";
import { calculateWritesPerMinute } from "./rate-limit-config";

// ─── Constants ────────────────────────────────────────────────────────────

const GOOGLE_DOC_BODY_START = 1; // Google Docs body content starts at index 1

// ─── Create Job ───────────────────────────────────────────────────────────

export async function createJob(
  db: Firestore,
  input: CreateWritingJobInput,
): Promise<WritingJob> {
  const { addDoc, collection, serverTimestamp, Timestamp } = await import(
    "firebase/firestore"
  );

  const totalBlocks = input.blocks.length;
  const durationSeconds = (input.intervalMs / 1000) * totalBlocks;
  const writesPerMinute = calculateWritesPerMinute(totalBlocks, durationSeconds);
  const now = new Date();

  const jobData: Omit<WritingJob, "jobId"> = {
    userId: input.userId,
    documentId: input.documentId,
    documentUrl: input.documentUrl,
    blocks: input.blocks,
    title: input.title,

    status: "pending",
    currentIndex: 0,
    totalBlocks,
    writtenCount: 0,
    failedCount: 0,

    intervalMs: input.intervalMs,
    estimatedWritesPerMinute: writesPerMinute,

    bodyEndIndex: GOOGLE_DOC_BODY_START,
    pendingList: null,

    createdAt: serverTimestamp() as FirestoreTimestamp,
    startedAt: null,
    lastWriteAt: null,
    completedAt: null,
    nextWriteAt: Timestamp.fromDate(now), // Ready to start immediately

    lockedBy: null,
    lockExpiresAt: null,

    lastError: null,
    retryCount: 0,
    consecutiveFailures: 0,
  };

  const ref = await addDoc(collection(db, COLLECTIONS.WRITING_JOBS), jobData);

  return { ...jobData, jobId: ref.id } as WritingJob;
}

// ─── Get Job ──────────────────────────────────────────────────────────────

export async function getJob(
  db: Firestore,
  jobId: string,
): Promise<WritingJob | null> {
  const { doc, getDoc } = await import("firebase/firestore");

  const snapshot = await getDoc(doc(db, COLLECTIONS.WRITING_JOBS, jobId));

  if (!snapshot.exists()) {
    return null;
  }

  return { ...snapshot.data(), jobId: snapshot.id } as WritingJob;
}

// ─── Update Job Progress ──────────────────────────────────────────────────

export async function updateJobProgress(
  db: Firestore,
  jobId: string,
  updates: JobProgressUpdate,
): Promise<void> {
  const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");

  const updateData: Record<string, unknown> = { ...updates };

  // Always update lastWriteAt when making progress updates
  if (
    "writtenCount" in updates ||
    "currentIndex" in updates ||
    "bodyEndIndex" in updates
  ) {
    updateData.lastWriteAt = serverTimestamp();
  }

  await updateDoc(doc(db, COLLECTIONS.WRITING_JOBS, jobId), updateData);
}

// ─── Update Job Status ────────────────────────────────────────────────────

export async function updateJobStatus(
  db: Firestore,
  jobId: string,
  status: JobStatus,
  additionalUpdates?: Partial<JobProgressUpdate>,
): Promise<void> {
  const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");

  const updates: Record<string, unknown> = {
    status,
    ...additionalUpdates,
  };

  // Set timestamps based on status
  if (status === "running" && !additionalUpdates?.startedAt) {
    updates.startedAt = serverTimestamp();
  }

  if (status === "completed" || status === "failed" || status === "cancelled") {
    updates.completedAt = serverTimestamp();
    updates.nextWriteAt = null;
  }

  await updateDoc(doc(db, COLLECTIONS.WRITING_JOBS, jobId), updates);
}

// ─── Get Ready Jobs ───────────────────────────────────────────────────────

export async function getReadyJobs(
  db: Firestore,
  limit: number = 10,
): Promise<WritingJob[]> {
  const {
    collection,
    query,
    where,
    orderBy,
    limit: limitFn,
    getDocs,
    Timestamp,
  } = await import("firebase/firestore");

  const now = Timestamp.now();

  // Find jobs that are:
  // 1. Status is "pending" or "running"
  // 2. nextWriteAt <= now (ready for next write)
  // Note: We don't filter by lock status here - that's checked when acquiring
  const q = query(
    collection(db, COLLECTIONS.WRITING_JOBS),
    where("status", "in", ["pending", "running"]),
    where("nextWriteAt", "<=", now),
    orderBy("nextWriteAt", "asc"),
    limitFn(limit),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ ...d.data(), jobId: d.id }) as WritingJob,
  );
}

// ─── Get User's Active Jobs ───────────────────────────────────────────────

export async function getUserActiveJobCount(
  db: Firestore,
  userId: string,
): Promise<number> {
  const { collection, query, where, getCountFromServer } = await import(
    "firebase/firestore"
  );

  const q = query(
    collection(db, COLLECTIONS.WRITING_JOBS),
    where("userId", "==", userId),
    where("status", "in", ["pending", "running", "paused"]),
  );

  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

// ─── Get User's Jobs ──────────────────────────────────────────────────────

export async function getUserJobs(
  db: Firestore,
  userId: string,
  statuses?: JobStatus[],
  maxResults: number = 20,
): Promise<WritingJob[]> {
  const {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
  } = await import("firebase/firestore");

  let q;

  if (statuses && statuses.length > 0) {
    q = query(
      collection(db, COLLECTIONS.WRITING_JOBS),
      where("userId", "==", userId),
      where("status", "in", statuses),
      orderBy("createdAt", "desc"),
      limit(maxResults),
    );
  } else {
    q = query(
      collection(db, COLLECTIONS.WRITING_JOBS),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(maxResults),
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ ...d.data(), jobId: d.id }) as WritingJob,
  );
}

// ─── Schedule Next Write ──────────────────────────────────────────────────

export async function scheduleNextWrite(
  db: Firestore,
  jobId: string,
  delayMs: number,
): Promise<void> {
  const { doc, updateDoc, Timestamp } = await import("firebase/firestore");

  const nextWriteAt = new Date(Date.now() + delayMs);

  await updateDoc(doc(db, COLLECTIONS.WRITING_JOBS, jobId), {
    nextWriteAt: Timestamp.fromDate(nextWriteAt),
  });
}

// ─── Mark Job Failed ──────────────────────────────────────────────────────

export async function markJobFailed(
  db: Firestore,
  jobId: string,
  error: string,
): Promise<void> {
  const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");

  await updateDoc(doc(db, COLLECTIONS.WRITING_JOBS, jobId), {
    status: "failed",
    lastError: error,
    completedAt: serverTimestamp(),
    nextWriteAt: null,
  });
}

// ─── Mark Job Completed ───────────────────────────────────────────────────

export async function markJobCompleted(
  db: Firestore,
  jobId: string,
): Promise<void> {
  const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");

  await updateDoc(doc(db, COLLECTIONS.WRITING_JOBS, jobId), {
    status: "completed",
    completedAt: serverTimestamp(),
    nextWriteAt: null,
  });
}

// ─── Acquire Job Lock ─────────────────────────────────────────────────────

export async function acquireJobLock(
  db: Firestore,
  jobId: string,
  workerId: string,
  ttlMs: number,
): Promise<boolean> {
  const { doc, getDoc, updateDoc, Timestamp } = await import(
    "firebase/firestore"
  );

  const jobRef = doc(db, COLLECTIONS.WRITING_JOBS, jobId);
  const now = Date.now();

  try {
    const snapshot = await getDoc(jobRef);
    if (!snapshot.exists()) return false;

    const job = snapshot.data() as WritingJob;

    // Check if already locked by someone else
    if (job.lockedBy && job.lockExpiresAt) {
      const expiry = (job.lockExpiresAt as FirestoreTimestamp).toMillis();
      if (expiry > now && job.lockedBy !== workerId) {
        return false; // Locked by another worker
      }
    }

    // Acquire lock
    const expiresAt = new Date(now + ttlMs);
    await updateDoc(jobRef, {
      lockedBy: workerId,
      lockExpiresAt: Timestamp.fromDate(expiresAt),
    });

    return true;
  } catch {
    return false;
  }
}

// ─── Release Job Lock ─────────────────────────────────────────────────────

export async function releaseJobLock(
  db: Firestore,
  jobId: string,
  workerId: string,
): Promise<boolean> {
  const { doc, getDoc, updateDoc } = await import("firebase/firestore");

  const jobRef = doc(db, COLLECTIONS.WRITING_JOBS, jobId);

  try {
    const snapshot = await getDoc(jobRef);
    if (!snapshot.exists()) return false;

    const job = snapshot.data() as WritingJob;

    // Only release if we hold the lock
    if (job.lockedBy !== workerId) {
      return false;
    }

    await updateDoc(jobRef, {
      lockedBy: null,
      lockExpiresAt: null,
    });

    return true;
  } catch {
    return false;
  }
}

// ─── Cleanup Old Jobs ─────────────────────────────────────────────────────

export async function cleanupOldJobs(
  db: Firestore,
  olderThanDays: number = 30,
): Promise<number> {
  const { collection, query, where, getDocs, deleteDoc, Timestamp } =
    await import("firebase/firestore");

  const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
  const cutoffTimestamp = Timestamp.fromDate(cutoff);

  // Only delete completed/failed/cancelled jobs
  const q = query(
    collection(db, COLLECTIONS.WRITING_JOBS),
    where("status", "in", ["completed", "failed", "cancelled"]),
    where("completedAt", "<", cutoffTimestamp),
  );

  const snapshot = await getDocs(q);
  let deletedCount = 0;

  for (const docSnapshot of snapshot.docs) {
    try {
      await deleteDoc(docSnapshot.ref);
      deletedCount++;
    } catch {
      // Best effort
    }
  }

  return deletedCount;
}
