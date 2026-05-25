// Monitoring and metrics tracking for rate limiting system
// Records API writes and provides metrics for analysis

import type { Firestore, Timestamp as FirestoreTimestamp } from "firebase/firestore";
import { COLLECTIONS, type ApiWrite, type JobStatus } from "./firestore-schema";

// ─── Types ────────────────────────────────────────────────────────────────

export interface JobMetrics {
  totalJobs: number;
  pendingJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  cancelledJobs: number;
}

export interface WriteMetrics {
  totalWrites: number;
  successfulWrites: number;
  failedWrites: number;
  successRate: number;
  averageDurationMs: number;
}

export interface UserMetrics {
  activeJobs: number;
  totalWritesToday: number;
  writesThisMinute: number;
  lastWriteAt: Date | null;
}

// ─── Record API Write ─────────────────────────────────────────────────────

export async function recordWrite(
  db: Firestore,
  userId: string,
  jobId: string,
  documentId: string,
  success: boolean,
  durationMs: number,
  blockIndex?: number,
  error?: string,
): Promise<void> {
  const { addDoc, collection, serverTimestamp } = await import(
    "firebase/firestore"
  );

  const writeData: Omit<ApiWrite, "writeId"> = {
    jobId,
    documentId,
    timestamp: serverTimestamp() as FirestoreTimestamp,
    success,
    durationMs,
    blockIndex,
    error,
  };

  await addDoc(
    collection(db, COLLECTIONS.API_WRITES, userId, "writes"),
    writeData,
  );
}

// ─── Get Write Count ──────────────────────────────────────────────────────

export async function getUserWriteCount(
  db: Firestore,
  userId: string,
  sinceMs: number,
): Promise<number> {
  const { collection, query, where, getCountFromServer, Timestamp } =
    await import("firebase/firestore");

  const since = Timestamp.fromMillis(Date.now() - sinceMs);

  const q = query(
    collection(db, COLLECTIONS.API_WRITES, userId, "writes"),
    where("timestamp", ">=", since),
  );

  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

// ─── Get Write Metrics ────────────────────────────────────────────────────

export async function getWriteMetrics(
  db: Firestore,
  userId: string,
  sinceMs: number,
): Promise<WriteMetrics> {
  const { collection, query, where, getDocs, Timestamp } = await import(
    "firebase/firestore"
  );

  const since = Timestamp.fromMillis(Date.now() - sinceMs);

  const q = query(
    collection(db, COLLECTIONS.API_WRITES, userId, "writes"),
    where("timestamp", ">=", since),
  );

  const snapshot = await getDocs(q);
  const writes = snapshot.docs.map((d) => d.data() as ApiWrite);

  const totalWrites = writes.length;
  const successfulWrites = writes.filter((w) => w.success).length;
  const failedWrites = totalWrites - successfulWrites;
  const successRate = totalWrites > 0 ? successfulWrites / totalWrites : 1;
  const totalDuration = writes.reduce((sum, w) => sum + w.durationMs, 0);
  const averageDurationMs = totalWrites > 0 ? totalDuration / totalWrites : 0;

  return {
    totalWrites,
    successfulWrites,
    failedWrites,
    successRate,
    averageDurationMs,
  };
}

// ─── Get Job Metrics ──────────────────────────────────────────────────────

export async function getJobMetrics(db: Firestore): Promise<JobMetrics> {
  const { collection, query, where, getCountFromServer } = await import(
    "firebase/firestore"
  );

  const jobsRef = collection(db, COLLECTIONS.WRITING_JOBS);

  const statusCounts: Record<JobStatus, number> = {
    pending: 0,
    running: 0,
    paused: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
  };

  // Query each status separately (Firestore limitation)
  for (const status of Object.keys(statusCounts) as JobStatus[]) {
    const q = query(jobsRef, where("status", "==", status));
    const snapshot = await getCountFromServer(q);
    statusCounts[status] = snapshot.data().count;
  }

  return {
    totalJobs: Object.values(statusCounts).reduce((a, b) => a + b, 0),
    pendingJobs: statusCounts.pending,
    runningJobs: statusCounts.running,
    completedJobs: statusCounts.completed,
    failedJobs: statusCounts.failed,
    cancelledJobs: statusCounts.cancelled,
  };
}

// ─── Get User Metrics ─────────────────────────────────────────────────────

export async function getUserMetrics(
  db: Firestore,
  userId: string,
): Promise<UserMetrics> {
  const { collection, query, where, getDocs, orderBy, limit } = await import(
    "firebase/firestore"
  );

  // Get active jobs count
  const jobsQuery = query(
    collection(db, COLLECTIONS.WRITING_JOBS),
    where("userId", "==", userId),
    where("status", "in", ["pending", "running", "paused"]),
  );
  const jobsSnapshot = await getDocs(jobsQuery);
  const activeJobs = jobsSnapshot.size;

  // Get writes today
  const oneDayMs = 24 * 60 * 60 * 1000;
  const totalWritesToday = await getUserWriteCount(db, userId, oneDayMs);

  // Get writes this minute
  const oneMinuteMs = 60 * 1000;
  const writesThisMinute = await getUserWriteCount(db, userId, oneMinuteMs);

  // Get last write timestamp
  const lastWriteQuery = query(
    collection(db, COLLECTIONS.API_WRITES, userId, "writes"),
    orderBy("timestamp", "desc"),
    limit(1),
  );
  const lastWriteSnapshot = await getDocs(lastWriteQuery);
  let lastWriteAt: Date | null = null;
  if (!lastWriteSnapshot.empty) {
    const data = lastWriteSnapshot.docs[0].data() as ApiWrite;
    lastWriteAt = (data.timestamp as FirestoreTimestamp).toDate();
  }

  return {
    activeJobs,
    totalWritesToday,
    writesThisMinute,
    lastWriteAt,
  };
}

// ─── Log Metrics (for debugging/observability) ────────────────────────────

export function logJobProcessingMetrics(
  workerId: string,
  jobId: string,
  metrics: {
    writesProcessed: number;
    totalDurationMs: number;
    success: boolean;
    error?: string;
  },
): void {
  const logData = {
    timestamp: new Date().toISOString(),
    workerId,
    jobId,
    ...metrics,
    avgWriteMs:
      metrics.writesProcessed > 0
        ? Math.round(metrics.totalDurationMs / metrics.writesProcessed)
        : 0,
  };

  // In production, this could send to a logging service
  if (process.env.NODE_ENV === "development") {
    console.log("[job-metrics]", JSON.stringify(logData));
  }
}

// ─── Cleanup Old Writes ───────────────────────────────────────────────────

export async function cleanupOldWrites(
  db: Firestore,
  userId: string,
  olderThanDays: number = 7,
): Promise<number> {
  const { collection, query, where, getDocs, deleteDoc, Timestamp } =
    await import("firebase/firestore");

  const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
  const cutoffTimestamp = Timestamp.fromDate(cutoff);

  const q = query(
    collection(db, COLLECTIONS.API_WRITES, userId, "writes"),
    where("timestamp", "<", cutoffTimestamp),
  );

  const snapshot = await getDocs(q);
  let deletedCount = 0;

  // Batch delete (Firestore has a limit of 500 per batch)
  const batchSize = 100;
  const docs = snapshot.docs;

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (doc) => {
        try {
          await deleteDoc(doc.ref);
          deletedCount++;
        } catch {
          // Best effort
        }
      }),
    );
  }

  return deletedCount;
}
