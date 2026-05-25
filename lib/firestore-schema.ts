// TypeScript types for Firestore collections used by the rate limiting
// and job queue system.

import type { Timestamp } from "firebase/firestore";
import type { Block } from "./doc-model";

// ─── Job Status ───────────────────────────────────────────────────────────

export type JobStatus =
  | "pending" // Waiting in queue to be processed
  | "running" // Currently being processed by cron
  | "paused" // User-initiated pause
  | "completed" // Successfully finished all writes
  | "failed" // Exhausted retries or non-retriable error
  | "cancelled"; // User cancelled

// ─── Writing Jobs Collection ──────────────────────────────────────────────
// Collection: writing_jobs/{jobId}

export interface WritingJob {
  // Identity
  jobId: string;
  userId: string;
  documentId: string;
  documentUrl: string;

  // Content
  blocks: Block[];
  title: string;

  // Progress tracking
  status: JobStatus;
  currentIndex: number; // Current block being written (0-indexed)
  totalBlocks: number;
  writtenCount: number; // Successfully written blocks
  failedCount: number; // Failed write attempts

  // Timing configuration
  intervalMs: number; // Milliseconds between writes
  estimatedWritesPerMinute: number;

  // Google Docs cursor tracking
  bodyEndIndex: number; // Current end-of-document index (starts at 1)
  pendingList: {
    ordering: "bullet" | "ordered";
    startIndex: number;
    endIndex: number;
  } | null;

  // Timestamps
  createdAt: Timestamp;
  startedAt: Timestamp | null;
  lastWriteAt: Timestamp | null;
  completedAt: Timestamp | null;
  nextWriteAt: Timestamp | null; // Scheduled time for next write

  // Distributed lock
  lockedBy: string | null; // Worker ID holding the lock
  lockExpiresAt: Timestamp | null;

  // Error tracking
  lastError: string | null;
  retryCount: number; // Total retry attempts across all writes
  consecutiveFailures: number; // Consecutive failures (resets on success)
}

// Type for creating a new job (without auto-generated fields)
export type CreateWritingJobInput = {
  userId: string;
  documentId: string;
  documentUrl: string;
  blocks: Block[];
  title: string;
  intervalMs: number;
};

// Type for job progress updates
export type JobProgressUpdate = Partial<
  Pick<
    WritingJob,
    | "status"
    | "currentIndex"
    | "writtenCount"
    | "failedCount"
    | "bodyEndIndex"
    | "pendingList"
    | "startedAt"
    | "lastWriteAt"
    | "nextWriteAt"
    | "completedAt"
    | "lastError"
    | "retryCount"
    | "consecutiveFailures"
    | "lockedBy"
    | "lockExpiresAt"
  >
>;

// ─── Distributed Locks Collection ─────────────────────────────────────────
// Collection: locks/{lockId}

export interface DistributedLock {
  lockId: string; // Format: "job:{jobId}" or "user:{userId}"
  heldBy: string; // Worker ID (e.g., "worker-{timestamp}-{random}")
  acquiredAt: Timestamp;
  expiresAt: Timestamp;
  heartbeatAt: Timestamp;
}

// ─── User Rate Limits Collection ──────────────────────────────────────────
// Collection: rate_limits/{userId}

export interface UserRateLimit {
  userId: string;

  // Sliding window counters
  writesInCurrentMinute: number;
  minuteWindowStart: Timestamp;

  // Daily aggregates (for analytics/monitoring)
  writesToday: number;
  dayStart: Timestamp;

  // Active job tracking
  activeJobCount: number;
  queuedJobCount: number;

  // Last updated
  updatedAt: Timestamp;
}

// ─── API Writes Tracking ──────────────────────────────────────────────────
// Collection: api_writes/{userId}/writes/{writeId}

export interface ApiWrite {
  writeId: string;
  jobId: string;
  documentId: string;
  timestamp: Timestamp;
  success: boolean;
  durationMs: number;
  error?: string;
  blockIndex?: number;
}

// ─── User Tokens Collection ───────────────────────────────────────────────
// Collection: user_tokens/{userId}
// Note: Tokens should be encrypted in production

export interface UserTokens {
  userId: string;
  accessToken: string; // Should be encrypted
  refreshToken: string; // Should be encrypted
  expiresAt: number; // Token expiry timestamp
  updatedAt: Timestamp;
}

// ─── Collection Names ─────────────────────────────────────────────────────

export const COLLECTIONS = {
  WRITING_JOBS: "writing_jobs",
  LOCKS: "locks",
  RATE_LIMITS: "rate_limits",
  API_WRITES: "api_writes",
  USER_TOKENS: "user_tokens",
} as const;

// ─── Helper Types ─────────────────────────────────────────────────────────

// Job with computed fields for API responses
export interface JobResponse {
  jobId: string;
  status: JobStatus;
  documentId: string;
  documentUrl: string;
  title: string;
  progress: {
    current: number;
    total: number;
    written: number;
    failed: number;
    percentage: number;
  };
  timing: {
    intervalMs: number;
    estimatedWritesPerMinute: number;
  };
  timestamps: {
    createdAt: string;
    startedAt: string | null;
    completedAt: string | null;
    lastWriteAt: string | null;
  };
  lastError: string | null;
}

// Convert WritingJob to API response format
export function toJobResponse(job: WritingJob): JobResponse {
  return {
    jobId: job.jobId,
    status: job.status,
    documentId: job.documentId,
    documentUrl: job.documentUrl,
    title: job.title,
    progress: {
      current: job.currentIndex,
      total: job.totalBlocks,
      written: job.writtenCount,
      failed: job.failedCount,
      percentage:
        job.totalBlocks > 0
          ? Math.round((job.writtenCount / job.totalBlocks) * 100)
          : 0,
    },
    timing: {
      intervalMs: job.intervalMs,
      estimatedWritesPerMinute: job.estimatedWritesPerMinute,
    },
    timestamps: {
      createdAt: job.createdAt?.toDate?.()?.toISOString() ?? "",
      startedAt: job.startedAt?.toDate?.()?.toISOString() ?? null,
      completedAt: job.completedAt?.toDate?.()?.toISOString() ?? null,
      lastWriteAt: job.lastWriteAt?.toDate?.()?.toISOString() ?? null,
    },
    lastError: job.lastError,
  };
}

// Valid state transitions for job status
export const VALID_JOB_TRANSITIONS: Record<string, JobStatus[]> = {
  pause: ["running", "pending"],
  resume: ["paused"],
  cancel: ["running", "pending", "paused"],
};

// Get new status after action
export function getStatusAfterAction(
  action: "pause" | "resume" | "cancel",
): JobStatus {
  switch (action) {
    case "pause":
      return "paused";
    case "resume":
      return "running";
    case "cancel":
      return "cancelled";
  }
}
