// Centralized rate limiting and timing configuration
// These values control session validation, write pacing, and queue management

export const RATE_LIMITS = {
  // ─── Session Validation ─────────────────────────────────────────────────
  // Minimum session duration in minutes - no exceptions
  MIN_SESSION_DURATION_MINUTES: 10,

  // ─── Per-User Rate Limits ───────────────────────────────────────────────
  // Safe limit: comfortable margin below Google's quotas
  SAFE_WRITES_PER_MINUTE: 30,
  // Hard limit: absolute maximum - reject sessions exceeding this
  HARD_WRITES_PER_MINUTE: 45,

  // ─── Write Timing ───────────────────────────────────────────────────────
  // Minimum milliseconds between consecutive writes
  MIN_WRITE_INTERVAL_MS: 1000,
  // Target interval for comfortable pacing
  TARGET_WRITE_INTERVAL_MS: 3000,
  // Maximum interval (for very slow schedules)
  MAX_WRITE_INTERVAL_MS: 300000, // 5 minutes

  // ─── Retry Configuration ────────────────────────────────────────────────
  // Maximum retry attempts before marking job as failed
  MAX_RETRIES: 5,
  // Initial backoff delay (doubles each retry: 2s, 4s, 8s, 16s)
  INITIAL_BACKOFF_MS: 2000,
  // Maximum backoff delay
  MAX_BACKOFF_MS: 16000,

  // ─── Queue Limits ───────────────────────────────────────────────────────
  // Maximum queued/pending jobs per free-tier user
  MAX_QUEUED_JOBS_FREE_TIER: 9,
  // Maximum concurrent running jobs per free-tier user
  MAX_CONCURRENT_JOBS_FREE_TIER: 3,
  // Maximum writes to process per cron invocation (keeps function under timeout)
  MAX_WRITES_PER_CRON_INVOCATION: 20,
  // Cron interval in milliseconds (informational - actual schedule in vercel.json)
  CRON_INTERVAL_MS: 60000,

  // ─── Distributed Locks ──────────────────────────────────────────────────
  // Lock time-to-live in milliseconds (must exceed max function duration)
  LOCK_TTL_MS: 120000, // 2 minutes
  // Lock heartbeat interval (for long-running processes)
  LOCK_HEARTBEAT_MS: 30000, // 30 seconds

  // ─── Chunk Configuration ────────────────────────────────────────────────
  // Default characters per chunk (for estimation)
  DEFAULT_CHUNK_SIZE: 140,
  // Average characters per word (for estimation)
  AVG_CHARS_PER_WORD: 5,
} as const;

// Type for the rate limits object
export type RateLimits = typeof RATE_LIMITS;

// Helper to calculate estimated writes per minute
export function calculateWritesPerMinute(
  totalBlocks: number,
  durationSeconds: number,
): number {
  if (durationSeconds <= 0 || totalBlocks <= 0) return 0;
  const intervalSeconds = durationSeconds / totalBlocks;
  return 60 / intervalSeconds;
}

// Helper to check if a write rate is within safe limits
export function isWriteRateSafe(writesPerMinute: number): boolean {
  return writesPerMinute <= RATE_LIMITS.SAFE_WRITES_PER_MINUTE;
}

// Helper to check if a write rate is within hard limits
export function isWriteRateAllowed(writesPerMinute: number): boolean {
  return writesPerMinute <= RATE_LIMITS.HARD_WRITES_PER_MINUTE;
}

// Helper to calculate exponential backoff delay
export function calculateBackoff(consecutiveFailures: number): number {
  const delay =
    RATE_LIMITS.INITIAL_BACKOFF_MS * Math.pow(2, consecutiveFailures);
  return Math.min(delay, RATE_LIMITS.MAX_BACKOFF_MS);
}

// Helper to format duration for display
export function formatDuration(totalSeconds: number): {
  hours: number;
  minutes: number;
  seconds: number;
  display: string;
} {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 && hours === 0) parts.push(`${seconds}s`);

  return {
    hours,
    minutes,
    seconds,
    display: parts.join(" ") || "0s",
  };
}
