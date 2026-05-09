import { NextResponse, type NextRequest } from "next/server";
import { google, type Auth } from "googleapis";
import {
  ACCESS_COOKIE,
  EXPIRY_COOKIE,
  REFRESH_COOKIE,
  setTokenCookies,
} from "@/lib/google-docs-cookies";

type CreateBody = {
  title?: unknown;
};

export async function POST(request: NextRequest) {
  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawTitle = typeof body.title === "string" ? body.title.trim() : "";
  const title = rawTitle.length > 0 ? rawTitle : "Docs Version History Export";

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const expiresAt = request.cookies.get(EXPIRY_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { error: "Google Docs is not connected. Click Connect Google Docs first." },
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
  const response = NextResponse.json({ documentId, documentUrl });
  if (refreshed) {
    setTokenCookies(response.cookies, refreshed);
  }
  return response;
}
