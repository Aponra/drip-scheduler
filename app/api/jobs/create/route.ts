import { NextResponse, type NextRequest } from "next/server";
import { google, type Auth } from "googleapis";
import {
  ACCESS_COOKIE,
  EXPIRY_COOKIE,
  REFRESH_COOKIE,
  setTokenCookies,
} from "@/lib/google-docs-cookies";
import { documentToBlocks } from "@/lib/doc-model";
import { validateSession, validateQueueLimit } from "@/lib/session-validator";
import { createJob, getUserActiveJobCount } from "@/lib/job-manager";
import { toJobResponse } from "@/lib/firestore-schema";
import { getFirebaseDb } from "@/lib/firebase-lazy";
import { RATE_LIMITS } from "@/lib/rate-limit-config";

// ─── Request Body Type ────────────────────────────────────────────────────

type CreateJobBody = {
  userId?: unknown;
  title?: unknown;
  document?: unknown;
  durationSeconds?: unknown;
};

// ─── POST /api/jobs/create ────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Parse request body
  let body: CreateJobBody;
  try {
    body = (await request.json()) as CreateJobBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 2. Validate required fields
  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const rawTitle = typeof body.title === "string" ? body.title.trim() : "";
  const title = rawTitle.length > 0 ? rawTitle : "Docs Version History Export";

  const document = body.document;
  if (!document || typeof document !== "object") {
    return NextResponse.json(
      { error: "document is required and must be a TipTap JSON object" },
      { status: 400 },
    );
  }

  const durationSeconds =
    typeof body.durationSeconds === "number" && body.durationSeconds > 0
      ? body.durationSeconds
      : null;
  if (!durationSeconds) {
    return NextResponse.json(
      { error: "durationSeconds is required and must be a positive number" },
      { status: 400 },
    );
  }

  // 3. Extract blocks from document
  const blocks = documentToBlocks(document).filter(
    (b) => b.text.length > 0 || b.type !== "paragraph",
  );

  if (blocks.length === 0) {
    return NextResponse.json(
      { error: "Document has no content to write" },
      { status: 400 },
    );
  }

  // 4. Validate session parameters (duration, rate limits)
  const validation = validateSession(blocks.length, durationSeconds);
  if (!validation.valid) {
    return NextResponse.json(
      {
        error: validation.error,
        validation: {
          valid: false,
          stats: validation.stats,
        },
      },
      { status: 400 },
    );
  }

  // 5. Check auth tokens
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const expiresAt = request.cookies.get(EXPIRY_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { error: "Google Docs is not connected. Please connect first." },
      { status: 401 },
    );
  }

  // 6. Check queue limits
  const db = await getFirebaseDb();
  const activeJobCount = await getUserActiveJobCount(db, userId);
  const queueValidation = validateQueueLimit(activeJobCount);

  if (!queueValidation.allowed) {
    return NextResponse.json(
      { error: queueValidation.error },
      { status: 429 },
    );
  }

  // 7. Setup OAuth client
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: "Google OAuth not configured on the server." },
      { status: 500 },
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiresAt ? Number(expiresAt) : undefined,
  });

  let refreshed: Auth.Credentials | null = null;
  oauth2Client.on("tokens", (tokens) => {
    refreshed = tokens;
  });

  // 8. Create Google Doc
  const docs = google.docs({ version: "v1", auth: oauth2Client });
  let documentId: string;

  try {
    const created = await docs.documents.create({
      requestBody: { title },
    });
    if (!created.data.documentId) {
      throw new Error("Google did not return a documentId");
    }
    documentId = created.data.documentId;
  } catch (err) {
    const e = err as {
      message?: string;
      code?: number;
      response?: { data?: { error?: { message?: string } } };
    };
    const upstream = e.response?.data?.error?.message;
    const message = upstream ?? e.message ?? "Failed to create Google Doc";
    const status = typeof e.code === "number" ? e.code : 500;
    return NextResponse.json({ error: message }, { status });
  }

  const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;

  // 9. Calculate interval
  const intervalMs =
    validation.adjustedIntervalMs ??
    Math.round((durationSeconds * 1000) / blocks.length);

  // Ensure minimum interval
  const finalIntervalMs = Math.max(intervalMs, RATE_LIMITS.MIN_WRITE_INTERVAL_MS);

  // 10. Create job in Firestore
  const job = await createJob(db, {
    userId,
    documentId,
    documentUrl,
    blocks,
    title,
    intervalMs: finalIntervalMs,
  });

  // 11. Store tokens for server-side cron processing
  // Note: In production, these should be encrypted
  await storeUserTokens(db, userId, {
    accessToken: accessToken || "",
    refreshToken: refreshToken || "",
    expiresAt: expiresAt ? Number(expiresAt) : undefined,
  });

  // 12. Build response
  const response = NextResponse.json({
    jobId: job.jobId,
    documentId,
    documentUrl,
    status: job.status,
    validation: {
      valid: true,
      warnings: validation.warnings,
      stats: validation.stats,
    },
    job: toJobResponse(job),
  });

  // Update cookies if tokens were refreshed
  if (refreshed) {
    setTokenCookies(response.cookies, refreshed);
  }

  return response;
}

// ─── Store User Tokens ────────────────────────────────────────────────────

async function storeUserTokens(
  db: Awaited<ReturnType<typeof getFirebaseDb>>,
  userId: string,
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresAt?: number;
  },
): Promise<void> {
  const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
  const { COLLECTIONS } = await import("@/lib/firestore-schema");

  // Note: In production, tokens should be encrypted before storage
  await setDoc(doc(db, COLLECTIONS.USER_TOKENS, userId), {
    userId,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: tokens.expiresAt ?? 0,
    updatedAt: serverTimestamp(),
  });
}
