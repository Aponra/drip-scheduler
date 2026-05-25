// Session validation for rate limiting
// Validates session parameters BEFORE starting to prevent quota violations

import {
  RATE_LIMITS,
  calculateWritesPerMinute,
  formatDuration,
} from "./rate-limit-config";

// ─── Validation Result Types ──────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  error?: string;
  warnings: string[];
  stats: SessionStats;
  adjustedIntervalMs?: number; // If we need to slow down to meet limits
}

export interface SessionStats {
  totalBlocks: number;
  durationSeconds: number;
  intervalMs: number;
  writesPerMinute: number;
  estimatedDuration: {
    hours: number;
    minutes: number;
    seconds: number;
    display: string;
  };
  // For display
  isSafe: boolean; // Within safe limits
  isAllowed: boolean; // Within hard limits
}

// ─── Main Validation Function ─────────────────────────────────────────────

export function validateSession(
  totalBlocks: number,
  requestedDurationSeconds: number,
): ValidationResult {
  const warnings: string[] = [];

  // Handle edge cases
  if (totalBlocks <= 0) {
    return {
      valid: false,
      error: "Document has no content to write.",
      warnings: [],
      stats: createEmptyStats(),
    };
  }

  if (requestedDurationSeconds <= 0) {
    return {
      valid: false,
      error: "Duration must be greater than zero.",
      warnings: [],
      stats: createEmptyStats(),
    };
  }

  // Check minimum duration
  const minDurationSeconds = RATE_LIMITS.MIN_SESSION_DURATION_MINUTES * 60;
  if (requestedDurationSeconds < minDurationSeconds) {
    const requestedMinutes = Math.round(requestedDurationSeconds / 60);
    return {
      valid: false,
      error:
        `Minimum session duration is ${RATE_LIMITS.MIN_SESSION_DURATION_MINUTES} minutes. ` +
        `Your ${requestedMinutes} minute session is too short.`,
      warnings: [],
      stats: createStats(totalBlocks, requestedDurationSeconds),
    };
  }

  // Calculate writes per minute
  const intervalMs = (requestedDurationSeconds * 1000) / totalBlocks;
  const writesPerMinute = calculateWritesPerMinute(
    totalBlocks,
    requestedDurationSeconds,
  );

  // Check against hard limit (reject)
  if (writesPerMinute > RATE_LIMITS.HARD_WRITES_PER_MINUTE) {
    // Calculate minimum required duration to meet hard limit
    const minRequiredDuration = Math.ceil(
      (totalBlocks / RATE_LIMITS.HARD_WRITES_PER_MINUTE) * 60,
    );
    const minDurationDisplay = formatDuration(minRequiredDuration).display;

    return {
      valid: false,
      error:
        `This session would require ${Math.round(writesPerMinute)} writes/minute, ` +
        `exceeding the maximum of ${RATE_LIMITS.HARD_WRITES_PER_MINUTE}. ` +
        `Please increase the duration to at least ${minDurationDisplay} or reduce content.`,
      warnings: [],
      stats: createStats(totalBlocks, requestedDurationSeconds),
    };
  }

  // Check minimum write interval
  if (intervalMs < RATE_LIMITS.MIN_WRITE_INTERVAL_MS) {
    const adjustedIntervalMs = RATE_LIMITS.MIN_WRITE_INTERVAL_MS;
    const adjustedDurationSeconds = (adjustedIntervalMs / 1000) * totalBlocks;
    const adjustedDisplay = formatDuration(adjustedDurationSeconds).display;

    warnings.push(
      `Interval adjusted from ${Math.round(intervalMs)}ms to ${adjustedIntervalMs}ms ` +
        `(minimum allowed). Total duration will be ~${adjustedDisplay}.`,
    );

    return {
      valid: true,
      warnings,
      stats: createStats(totalBlocks, adjustedDurationSeconds),
      adjustedIntervalMs,
    };
  }

  // Check against safe limit (warn but allow)
  if (writesPerMinute > RATE_LIMITS.SAFE_WRITES_PER_MINUTE) {
    // Calculate recommended duration for safe limit
    const recommendedDuration = Math.ceil(
      (totalBlocks / RATE_LIMITS.SAFE_WRITES_PER_MINUTE) * 60,
    );
    const recommendedDisplay = formatDuration(recommendedDuration).display;

    warnings.push(
      `Your session will use ${Math.round(writesPerMinute)} writes/minute, ` +
        `which is above the recommended ${RATE_LIMITS.SAFE_WRITES_PER_MINUTE}. ` +
        `Consider increasing duration to ${recommendedDisplay} to avoid potential rate limiting.`,
    );
  }

  return {
    valid: true,
    warnings,
    stats: createStats(totalBlocks, requestedDurationSeconds),
  };
}

// ─── Helper Functions ─────────────────────────────────────────────────────

function createStats(
  totalBlocks: number,
  durationSeconds: number,
): SessionStats {
  const intervalMs =
    totalBlocks > 0 ? (durationSeconds * 1000) / totalBlocks : 0;
  const writesPerMinute = calculateWritesPerMinute(totalBlocks, durationSeconds);

  return {
    totalBlocks,
    durationSeconds,
    intervalMs,
    writesPerMinute,
    estimatedDuration: formatDuration(durationSeconds),
    isSafe: writesPerMinute <= RATE_LIMITS.SAFE_WRITES_PER_MINUTE,
    isAllowed: writesPerMinute <= RATE_LIMITS.HARD_WRITES_PER_MINUTE,
  };
}

function createEmptyStats(): SessionStats {
  return {
    totalBlocks: 0,
    durationSeconds: 0,
    intervalMs: 0,
    writesPerMinute: 0,
    estimatedDuration: { hours: 0, minutes: 0, seconds: 0, display: "0s" },
    isSafe: true,
    isAllowed: true,
  };
}

// ─── Validation for Queue Limits ──────────────────────────────────────────

export interface QueueValidationResult {
  allowed: boolean;
  error?: string;
  currentActiveJobs: number;
  maxAllowed: number;
}

export function validateQueueLimit(
  currentActiveJobs: number,
): QueueValidationResult {
  const maxAllowed = RATE_LIMITS.MAX_QUEUED_JOBS_FREE_TIER;

  if (currentActiveJobs >= maxAllowed) {
    return {
      allowed: false,
      error:
        `You already have ${currentActiveJobs} active/queued jobs. ` +
        `Maximum allowed is ${maxAllowed}. ` +
        `Please wait for existing jobs to complete or cancel them.`,
      currentActiveJobs,
      maxAllowed,
    };
  }

  return {
    allowed: true,
    currentActiveJobs,
    maxAllowed,
  };
}

// ─── Estimate API Requests ────────────────────────────────────────────────

export interface RequestEstimate {
  textInserts: number;
  styleRequests: number; // Rough estimate - actual depends on formatting
  bulletRequests: number; // Rough estimate
  totalRequests: number;
}

export function estimateApiRequests(
  totalBlocks: number,
  hasFormatting: boolean = true,
): RequestEstimate {
  // Each block: 1 text insert
  const textInserts = totalBlocks;

  // Style requests: roughly 1-2 per block if formatting exists
  const styleRequests = hasFormatting ? Math.ceil(totalBlocks * 1.5) : 0;

  // Bullet requests: assume ~10% of blocks are list items, batched
  const bulletRequests = Math.ceil(totalBlocks * 0.1);

  return {
    textInserts,
    styleRequests,
    bulletRequests,
    totalRequests: textInserts + styleRequests + bulletRequests,
  };
}
