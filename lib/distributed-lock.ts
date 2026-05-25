// Firestore-based distributed locking for job queue
// Prevents concurrent workers from processing the same job

import type { Firestore, Timestamp as FirestoreTimestamp } from "firebase/firestore";
import { RATE_LIMITS } from "./rate-limit-config";
import { COLLECTIONS, type DistributedLock } from "./firestore-schema";

// ─── Types ────────────────────────────────────────────────────────────────

export interface LockResult {
  acquired: boolean;
  lockId: string;
  workerId: string;
  expiresAt?: Date;
  reason?: string;
}

// ─── Worker ID Generation ─────────────────────────────────────────────────

export function generateWorkerId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `worker-${timestamp}-${random}`;
}

// ─── Lock Acquisition ─────────────────────────────────────────────────────

export async function acquireLock(
  db: Firestore,
  lockId: string,
  workerId: string,
): Promise<LockResult> {
  const { doc, getDoc, setDoc, serverTimestamp, Timestamp } = await import(
    "firebase/firestore"
  );

  const lockRef = doc(db, COLLECTIONS.LOCKS, lockId);
  const now = Date.now();
  const expiresAt = new Date(now + RATE_LIMITS.LOCK_TTL_MS);

  try {
    const existing = await getDoc(lockRef);

    if (existing.exists()) {
      const data = existing.data() as DistributedLock;
      const lockExpiry = (data.expiresAt as FirestoreTimestamp).toMillis();

      // Lock exists and is not expired
      if (lockExpiry > now) {
        // Check if we already hold this lock
        if (data.heldBy === workerId) {
          // We already hold it, just renew
          await setDoc(lockRef, {
            lockId,
            heldBy: workerId,
            acquiredAt: data.acquiredAt,
            expiresAt: Timestamp.fromDate(expiresAt),
            heartbeatAt: serverTimestamp(),
          });
          return { acquired: true, lockId, workerId, expiresAt };
        }

        // Another worker holds the lock
        return {
          acquired: false,
          lockId,
          workerId,
          reason: `Lock held by ${data.heldBy} until ${new Date(lockExpiry).toISOString()}`,
        };
      }
      // Lock expired - we can take over
    }

    // Attempt to acquire the lock
    // Note: In a high-concurrency scenario, consider using transactions
    await setDoc(lockRef, {
      lockId,
      heldBy: workerId,
      acquiredAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt),
      heartbeatAt: serverTimestamp(),
    });

    return { acquired: true, lockId, workerId, expiresAt };
  } catch (error) {
    // Concurrent write or other error - lock acquisition failed
    return {
      acquired: false,
      lockId,
      workerId,
      reason: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ─── Lock Renewal ─────────────────────────────────────────────────────────

export async function renewLock(
  db: Firestore,
  lockId: string,
  workerId: string,
): Promise<boolean> {
  const { doc, getDoc, updateDoc, serverTimestamp, Timestamp } = await import(
    "firebase/firestore"
  );

  const lockRef = doc(db, COLLECTIONS.LOCKS, lockId);

  try {
    const existing = await getDoc(lockRef);

    if (!existing.exists()) {
      return false;
    }

    const data = existing.data() as DistributedLock;
    if (data.heldBy !== workerId) {
      return false;
    }

    const newExpiry = new Date(Date.now() + RATE_LIMITS.LOCK_TTL_MS);
    await updateDoc(lockRef, {
      expiresAt: Timestamp.fromDate(newExpiry),
      heartbeatAt: serverTimestamp(),
    });

    return true;
  } catch {
    return false;
  }
}

// ─── Lock Release ─────────────────────────────────────────────────────────

export async function releaseLock(
  db: Firestore,
  lockId: string,
  workerId: string,
): Promise<boolean> {
  const { doc, getDoc, deleteDoc } = await import("firebase/firestore");

  const lockRef = doc(db, COLLECTIONS.LOCKS, lockId);

  try {
    const existing = await getDoc(lockRef);

    if (!existing.exists()) {
      return true; // Already released
    }

    const data = existing.data() as DistributedLock;
    if (data.heldBy !== workerId) {
      return false; // We don't own this lock
    }

    await deleteDoc(lockRef);
    return true;
  } catch {
    // Best effort - lock will expire naturally
    return false;
  }
}

// ─── Lock Checking ────────────────────────────────────────────────────────

export async function isLockHeld(
  db: Firestore,
  lockId: string,
): Promise<{ held: boolean; heldBy?: string; expiresAt?: Date }> {
  const { doc, getDoc } = await import("firebase/firestore");

  const lockRef = doc(db, COLLECTIONS.LOCKS, lockId);

  try {
    const existing = await getDoc(lockRef);

    if (!existing.exists()) {
      return { held: false };
    }

    const data = existing.data() as DistributedLock;
    const expiry = (data.expiresAt as FirestoreTimestamp).toMillis();
    const now = Date.now();

    if (expiry <= now) {
      return { held: false }; // Expired
    }

    return {
      held: true,
      heldBy: data.heldBy,
      expiresAt: new Date(expiry),
    };
  } catch {
    return { held: false };
  }
}

// ─── Helper: Create Lock ID ───────────────────────────────────────────────

export function createJobLockId(jobId: string): string {
  return `job:${jobId}`;
}

export function createUserLockId(userId: string): string {
  return `user:${userId}`;
}

// ─── Cleanup Expired Locks ────────────────────────────────────────────────

export async function cleanupExpiredLocks(db: Firestore): Promise<number> {
  const { collection, query, where, getDocs, deleteDoc, Timestamp } =
    await import("firebase/firestore");

  const now = Timestamp.now();
  const locksRef = collection(db, COLLECTIONS.LOCKS);

  const expiredQuery = query(locksRef, where("expiresAt", "<", now));

  const snapshot = await getDocs(expiredQuery);
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
