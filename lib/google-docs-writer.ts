// Server-side Google Docs write execution
// Used by the cron processor to write blocks to Google Docs

import { google } from "googleapis";
import type { WritingJob } from "./firestore-schema";
import type { Block } from "./doc-model";
import {
  prepareBlockExport,
  buildBulletsRequest,
  type GDocsRequest,
} from "./google-docs-builder";
import { RATE_LIMITS, calculateBackoff } from "./rate-limit-config";

// ─── Types ────────────────────────────────────────────────────────────────

export interface WriteResult {
  success: boolean;
  newBodyEndIndex?: number;
  insertedText?: string;
  styleRequestsCount?: number;
  error?: string;
  retriable: boolean;
  durationMs: number;
}

export interface FlushBulletsResult {
  success: boolean;
  error?: string;
  retriable: boolean;
}

export interface TokenCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
}

// ─── OAuth Client Creation ────────────────────────────────────────────────

function createOAuthClient(tokens: TokenCredentials) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  oauth2Client.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expiry_date: tokens.expiresAt,
  });

  return oauth2Client;
}

// ─── Execute Single Write ─────────────────────────────────────────────────

export async function executeWrite(
  job: WritingJob,
  tokens: TokenCredentials,
): Promise<WriteResult> {
  const startTime = Date.now();
  const block = job.blocks[job.currentIndex];

  if (!block) {
    return {
      success: false,
      error: `Block at index ${job.currentIndex} not found`,
      retriable: false,
      durationMs: Date.now() - startTime,
    };
  }

  const oauth2Client = createOAuthClient(tokens);
  const docs = google.docs({ version: "v1", auth: oauth2Client });
  const prepared = prepareBlockExport(block);

  try {
    // 1. Insert text at end of document
    await docs.documents.batchUpdate({
      documentId: job.documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              endOfSegmentLocation: {},
              text: prepared.insertText,
            },
          },
        ],
      },
    });

    const newBodyEnd = job.bodyEndIndex + prepared.insertText.length;

    // 2. Apply styling (bold, italic, links, colors, headings)
    const styleReqs = prepared.buildStyleRequests(job.bodyEndIndex);

    if (styleReqs.length > 0) {
      // Batch style requests (max 200 per batch)
      const batches = chunkArray(styleReqs, 200);

      for (const batch of batches) {
        await docs.documents.batchUpdate({
          documentId: job.documentId,
          requestBody: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            requests: batch as any,
          },
        });
      }
    }

    return {
      success: true,
      newBodyEndIndex: newBodyEnd,
      insertedText: prepared.insertText,
      styleRequestsCount: styleReqs.length,
      retriable: false,
      durationMs: Date.now() - startTime,
    };
  } catch (err: unknown) {
    const error = err as {
      code?: number;
      message?: string;
      response?: { status?: number; data?: { error?: { message?: string } } };
    };

    const status = error.code || error.response?.status;
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "Unknown error writing to Google Docs";

    // Determine if retriable
    const retriable =
      status === 429 || // Rate limited
      status === 503 || // Service unavailable
      (typeof status === "number" && status >= 500); // Server errors

    return {
      success: false,
      error: message,
      retriable,
      durationMs: Date.now() - startTime,
    };
  }
}

// ─── Flush Pending Bullets ────────────────────────────────────────────────

export async function flushPendingBullets(
  documentId: string,
  pendingList: NonNullable<WritingJob["pendingList"]>,
  tokens: TokenCredentials,
): Promise<FlushBulletsResult> {
  const { ordering, startIndex, endIndex } = pendingList;

  if (endIndex <= startIndex) {
    return { success: true, retriable: false };
  }

  const oauth2Client = createOAuthClient(tokens);
  const docs = google.docs({ version: "v1", auth: oauth2Client });

  try {
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [buildBulletsRequest(ordering, startIndex, endIndex)],
      },
    });

    return { success: true, retriable: false };
  } catch (err: unknown) {
    const error = err as {
      code?: number;
      message?: string;
      response?: { status?: number; data?: { error?: { message?: string } } };
    };

    const status = error.code || error.response?.status;
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "Failed to apply bullets";

    const retriable =
      status === 429 || status === 503 || (typeof status === "number" && status >= 500);

    return {
      success: false,
      error: message,
      retriable,
    };
  }
}

// ─── Process Job Block ────────────────────────────────────────────────────
// Higher-level function that handles list batching

export interface ProcessBlockResult {
  success: boolean;
  newBodyEndIndex: number;
  newPendingList: WritingJob["pendingList"];
  error?: string;
  retriable: boolean;
  durationMs: number;
}

export async function processJobBlock(
  job: WritingJob,
  tokens: TokenCredentials,
): Promise<ProcessBlockResult> {
  const startTime = Date.now();
  const block = job.blocks[job.currentIndex];

  if (!block) {
    return {
      success: false,
      newBodyEndIndex: job.bodyEndIndex,
      newPendingList: job.pendingList,
      error: `Block at index ${job.currentIndex} not found`,
      retriable: false,
      durationMs: Date.now() - startTime,
    };
  }

  // Check if we need to flush bullets before this block
  // (previous list run ended)
  let pendingList = job.pendingList;

  if (pendingList && !isSameListRun(pendingList, block)) {
    const flushResult = await flushPendingBullets(
      job.documentId,
      pendingList,
      tokens,
    );
    if (!flushResult.success) {
      return {
        success: false,
        newBodyEndIndex: job.bodyEndIndex,
        newPendingList: pendingList,
        error: flushResult.error,
        retriable: flushResult.retriable,
        durationMs: Date.now() - startTime,
      };
    }
    pendingList = null;
  }

  // Execute the write
  const writeResult = await executeWrite(job, tokens);

  if (!writeResult.success) {
    return {
      success: false,
      newBodyEndIndex: job.bodyEndIndex,
      newPendingList: pendingList,
      error: writeResult.error,
      retriable: writeResult.retriable,
      durationMs: writeResult.durationMs,
    };
  }

  const newBodyEndIndex = writeResult.newBodyEndIndex!;

  // Update pending list for list items
  if (block.type === "list-item") {
    if (pendingList && pendingList.ordering === block.ordering) {
      // Extend existing list run
      pendingList = {
        ...pendingList,
        endIndex: newBodyEndIndex,
      };
    } else {
      // Start new list run
      pendingList = {
        ordering: block.ordering,
        startIndex: job.bodyEndIndex,
        endIndex: newBodyEndIndex,
      };
    }
  }

  // If this is the last block, flush any pending bullets
  const isLastBlock = job.currentIndex === job.totalBlocks - 1;
  if (isLastBlock && pendingList) {
    const flushResult = await flushPendingBullets(
      job.documentId,
      pendingList,
      tokens,
    );
    if (!flushResult.success) {
      // Don't fail the whole job, just log the error
      console.error(
        `[google-docs-writer] Failed to flush final bullets: ${flushResult.error}`,
      );
    }
    pendingList = null;
  }

  return {
    success: true,
    newBodyEndIndex,
    newPendingList: pendingList,
    retriable: false,
    durationMs: Date.now() - startTime,
  };
}

// ─── Helper Functions ─────────────────────────────────────────────────────

function isSameListRun(
  pendingList: NonNullable<WritingJob["pendingList"]>,
  block: Block,
): boolean {
  return (
    block.type === "list-item" && block.ordering === pendingList.ordering
  );
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Re-export calculateBackoff for convenience
export { calculateBackoff };
