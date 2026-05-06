import { NextResponse, type NextRequest } from "next/server";
import { google, type Auth, type docs_v1 } from "googleapis";
import {
  ACCESS_COOKIE,
  EXPIRY_COOKIE,
  REFRESH_COOKIE,
  setTokenCookies,
} from "@/lib/google-docs-cookies";

type BatchBody = {
  documentId?: unknown;
  requests?: unknown;
};

const MAX_REQUESTS_PER_BATCH = 200;

export async function POST(request: NextRequest) {
  let body: BatchBody;
  try {
    body = (await request.json()) as BatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const documentId =
    typeof body.documentId === "string" ? body.documentId.trim() : "";
  if (!documentId) {
    return NextResponse.json(
      { error: "documentId is required" },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.requests) || body.requests.length === 0) {
    return NextResponse.json(
      { error: "requests must be a non-empty array" },
      { status: 400 },
    );
  }
  if (body.requests.length > MAX_REQUESTS_PER_BATCH) {
    return NextResponse.json(
      {
        error: `Too many requests (max ${MAX_REQUESTS_PER_BATCH} per batch)`,
      },
      { status: 400 },
    );
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const expiresAt = request.cookies.get(EXPIRY_COOKIE)?.value;
  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { error: "Google Docs is not connected." },
      { status: 401 },
    );
  }

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

  const docs = google.docs({ version: "v1", auth: oauth2Client });

  try {
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: body.requests as docs_v1.Schema$Request[],
      },
    });
  } catch (err) {
    const e = err as {
      message?: string;
      code?: number;
      response?: { data?: { error?: { message?: string } } };
    };
    const upstream = e.response?.data?.error?.message;
    const message = upstream ?? e.message ?? "Failed to update Google Doc";
    const status = typeof e.code === "number" ? e.code : 500;
    return NextResponse.json({ error: message }, { status });
  }

  const response = NextResponse.json({ ok: true });
  if (refreshed) {
    setTokenCookies(response.cookies, refreshed);
  }
  return response;
}
