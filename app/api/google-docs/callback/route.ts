import { NextResponse, type NextRequest } from "next/server";
import { google } from "googleapis";
import { clearTokenCookies, setTokenCookies } from "@/lib/google-docs-cookies";

function homeRedirect(request: NextRequest, params: Record<string, string>) {
  const origin = new URL(request.url).origin;
  const target = new URL("/", origin);
  for (const [k, v] of Object.entries(params)) {
    target.searchParams.set(k, v);
  }
  return NextResponse.redirect(target);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error === "access_denied") {
    const response = homeRedirect(request, { googleDocs: "denied" });
    clearTokenCookies(response.cookies);
    return response;
  }

  if (error) {
    return homeRedirect(request, { googleDocs: "error", reason: error });
  }

  if (!code) {
    return homeRedirect(request, {
      googleDocs: "error",
      reason: "missing_code",
    });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return homeRedirect(request, {
      googleDocs: "error",
      reason: "server_not_configured",
    });
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );

  let tokens;
  try {
    const result = await oauth2Client.getToken(code);
    tokens = result.tokens;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Token exchange failed";
    return homeRedirect(request, {
      googleDocs: "error",
      reason: message.slice(0, 200),
    });
  }

  const response = homeRedirect(request, { googleDocs: "connected" });
  setTokenCookies(response.cookies, tokens);
  return response;
}
