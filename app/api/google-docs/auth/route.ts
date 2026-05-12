import { NextResponse } from "next/server";
import { google } from "googleapis";

// Minimum scope: `drive.file` lets the app create and edit ONLY the documents
// it creates (or that the user opens to it through a Google Picker, which we
// don't use). It does not grant access to the rest of the user's Drive.
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return new NextResponse(
      "Google OAuth not configured. Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI.",
      { status: 500 },
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  return NextResponse.redirect(url);
}
