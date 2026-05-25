import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  EXPIRY_COOKIE,
  REFRESH_COOKIE,
} from "@/lib/google-docs-cookies";
import { COLLECTIONS, type UserTokens } from "@/lib/firestore-schema";
import { getFirebaseDb } from "@/lib/firebase-lazy";

// ─── POST /api/user/tokens ────────────────────────────────────────────────
// Store user's Google OAuth tokens for server-side cron processing
// Called when creating a job to ensure tokens are available

type StoreTokensBody = {
  userId?: unknown;
};

export async function POST(request: NextRequest) {
  // 1. Parse request body
  let body: StoreTokensBody;
  try {
    body = (await request.json()) as StoreTokensBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 2. Validate userId
  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // 3. Get tokens from cookies
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const expiresAt = request.cookies.get(EXPIRY_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { error: "No Google Docs tokens found. Please connect first." },
      { status: 401 },
    );
  }

  // 4. Store tokens in Firestore
  const db = await getFirebaseDb();
  const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");

  // Note: In production, these tokens should be encrypted before storage
  // Consider using a library like crypto-js or a KMS service
  const tokenData: Omit<UserTokens, "updatedAt"> & { updatedAt: ReturnType<typeof serverTimestamp> } = {
    userId,
    accessToken: accessToken || "",
    refreshToken: refreshToken || "",
    expiresAt: expiresAt ? Number(expiresAt) : 0,
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, COLLECTIONS.USER_TOKENS, userId), tokenData);

  return NextResponse.json({
    message: "Tokens stored successfully",
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    expiresAt: expiresAt ? Number(expiresAt) : null,
  });
}

// ─── GET /api/user/tokens ─────────────────────────────────────────────────
// Check if tokens exist for a user

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const db = await getFirebaseDb();
  const { doc, getDoc } = await import("firebase/firestore");

  const snapshot = await getDoc(doc(db, COLLECTIONS.USER_TOKENS, userId));

  if (!snapshot.exists()) {
    return NextResponse.json({
      exists: false,
      hasAccessToken: false,
      hasRefreshToken: false,
    });
  }

  const data = snapshot.data() as UserTokens;

  return NextResponse.json({
    exists: true,
    hasAccessToken: !!data.accessToken,
    hasRefreshToken: !!data.refreshToken,
    expiresAt: data.expiresAt || null,
    updatedAt: data.updatedAt,
  });
}

// ─── DELETE /api/user/tokens ──────────────────────────────────────────────
// Remove stored tokens (for security/logout)

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const db = await getFirebaseDb();
  const { doc, deleteDoc } = await import("firebase/firestore");

  await deleteDoc(doc(db, COLLECTIONS.USER_TOKENS, userId));

  return NextResponse.json({
    message: "Tokens removed successfully",
  });
}
