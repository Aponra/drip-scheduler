import { NextResponse, type NextRequest } from "next/server";
import {
  getReadyJobs,
  updateJobProgress,
  markJobFailed,
  markJobCompleted,
  scheduleNextWrite,
  acquireJobLock,
  releaseJobLock,
} from "@/lib/job-manager";
import { processJobBlock, calculateBackoff } from "@/lib/google-docs-writer";
import { RATE_LIMITS } from "@/lib/rate-limit-config";
import { COLLECTIONS, type UserTokens } from "@/lib/firestore-schema";
import { getFirebaseDb } from "@/lib/firebase-lazy";
import { generateWorkerId } from "@/lib/distributed-lock";

// ─── GET /api/jobs/process ────────────────────────────────────────────────
// Cron endpoint - processes ready jobs
// Called by Vercel Cron every minute

export async function GET(request: NextRequest) {
  // 1. Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Allow bypass in development without secret
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getFirebaseDb();
  const workerId = generateWorkerId();

  const results: ProcessResult[] = [];
  const errors: string[] = [];
  const startTime = Date.now();

  try {
    // 2. Get jobs ready for processing
    const readyJobs = await getReadyJobs(db, 10);

    if (readyJobs.length === 0) {
      return NextResponse.json({
        message: "No jobs ready for processing",
        processed: 0,
        workerId,
        durationMs: Date.now() - startTime,
      });
    }

    // 3. Process each job
    for (const job of readyJobs) {
      // Check if we're approaching function timeout (leave 5s buffer)
      const elapsed = Date.now() - startTime;
      if (elapsed > 55000) {
        // 55 seconds
        break; // Let next cron invocation continue
      }

      // Try to acquire lock
      const lockAcquired = await acquireJobLock(
        db,
        job.jobId,
        workerId,
        RATE_LIMITS.LOCK_TTL_MS,
      );

      if (!lockAcquired) {
        results.push({
          jobId: job.jobId,
          status: "skipped",
          reason: "locked by another worker",
        });
        continue;
      }

      try {
        // Check if job was cancelled/paused while we were waiting
        if (job.status === "paused" || job.status === "cancelled") {
          results.push({
            jobId: job.jobId,
            status: "skipped",
            reason: `job is ${job.status}`,
          });
          continue;
        }

        // Mark as running if pending
        if (job.status === "pending") {
          await updateJobProgress(db, job.jobId, { status: "running" });
        }

        // Get user's tokens
        const tokens = await getUserTokens(db, job.userId);
        if (!tokens) {
          await markJobFailed(
            db,
            job.jobId,
            "User tokens not found or expired. Please reconnect Google Docs.",
          );
          results.push({
            jobId: job.jobId,
            status: "failed",
            reason: "tokens not found",
          });
          continue;
        }

        // Process blocks
        let writesThisJob = 0;
        let currentIndex = job.currentIndex;
        let bodyEndIndex = job.bodyEndIndex;
        let pendingList = job.pendingList;
        let consecutiveFailures = job.consecutiveFailures;

        while (
          writesThisJob < RATE_LIMITS.MAX_WRITES_PER_CRON_INVOCATION &&
          currentIndex < job.totalBlocks
        ) {
          // Create a snapshot of current state for processing
          const jobSnapshot = {
            ...job,
            currentIndex,
            bodyEndIndex,
            pendingList,
          };

          const result = await processJobBlock(jobSnapshot, {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: tokens.expiresAt,
          });

          if (result.success) {
            currentIndex++;
            bodyEndIndex = result.newBodyEndIndex;
            pendingList = result.newPendingList;
            consecutiveFailures = 0;
            writesThisJob++;

            // Update progress
            await updateJobProgress(db, job.jobId, {
              currentIndex,
              writtenCount: currentIndex,
              bodyEndIndex,
              pendingList,
              consecutiveFailures: 0,
            });

            // If completed, mark as done
            if (currentIndex >= job.totalBlocks) {
              await markJobCompleted(db, job.jobId);
              results.push({
                jobId: job.jobId,
                status: "completed",
                writesThisInvocation: writesThisJob,
              });
              break;
            }

            // Schedule next write based on interval
            // Only if we've hit the per-invocation limit
            if (writesThisJob >= RATE_LIMITS.MAX_WRITES_PER_CRON_INVOCATION) {
              await scheduleNextWrite(db, job.jobId, job.intervalMs);
            }
          } else {
            consecutiveFailures++;

            if (result.retriable && consecutiveFailures < RATE_LIMITS.MAX_RETRIES) {
              // Schedule retry with backoff
              const backoffMs = calculateBackoff(consecutiveFailures);

              await updateJobProgress(db, job.jobId, {
                consecutiveFailures,
                failedCount: job.failedCount + 1,
                lastError: result.error,
              });

              await scheduleNextWrite(db, job.jobId, backoffMs);

              results.push({
                jobId: job.jobId,
                status: "retry_scheduled",
                reason: result.error,
                backoffMs,
                consecutiveFailures,
              });
              break;
            } else {
              // Non-retriable or max retries exceeded
              await markJobFailed(
                db,
                job.jobId,
                result.error || "Maximum retries exceeded",
              );

              results.push({
                jobId: job.jobId,
                status: "failed",
                reason: result.error,
                consecutiveFailures,
              });
              break;
            }
          }
        }

        // If we processed successfully but didn't complete or fail
        if (
          writesThisJob > 0 &&
          currentIndex < job.totalBlocks &&
          !results.find((r) => r.jobId === job.jobId)
        ) {
          // Schedule next batch
          await scheduleNextWrite(db, job.jobId, job.intervalMs);

          results.push({
            jobId: job.jobId,
            status: "in_progress",
            writesThisInvocation: writesThisJob,
            progress: `${currentIndex}/${job.totalBlocks}`,
          });
        }
      } finally {
        // Always release lock
        await releaseJobLock(db, job.jobId, workerId);
      }
    }

    return NextResponse.json({
      message: "Processing complete",
      processed: results.filter(
        (r) => r.status === "completed" || r.status === "in_progress",
      ).length,
      results,
      errors: errors.length > 0 ? errors : undefined,
      workerId,
      durationMs: Date.now() - startTime,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    errors.push(errorMessage);

    return NextResponse.json(
      {
        error: errorMessage,
        results,
        workerId,
        durationMs: Date.now() - startTime,
      },
      { status: 500 },
    );
  }
}

// ─── Helper Types ─────────────────────────────────────────────────────────

type ProcessResult = {
  jobId: string;
  status: string;
  reason?: string;
  writesThisInvocation?: number;
  progress?: string;
  backoffMs?: number;
  consecutiveFailures?: number;
};

// ─── Get User Tokens ──────────────────────────────────────────────────────

async function getUserTokens(
  db: Awaited<ReturnType<typeof getFirebaseDb>>,
  userId: string,
): Promise<UserTokens | null> {
  const { doc, getDoc } = await import("firebase/firestore");

  try {
    const snapshot = await getDoc(doc(db, COLLECTIONS.USER_TOKENS, userId));

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data() as UserTokens;

    // Check if tokens exist
    if (!data.accessToken && !data.refreshToken) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}
