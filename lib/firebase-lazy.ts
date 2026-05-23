/**
 * Lazy Firebase Loader
 *
 * This module loads Firebase only when needed, reducing initial bundle size
 * by ~230KB for users who don't sign in.
 */

import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseApp } from "firebase/app";

// Cached instances
let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseDb: Firestore | null = null;
let initPromise: Promise<void> | null = null;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Initialize Firebase lazily. Only loads the Firebase SDK when called.
 * Subsequent calls return cached instances.
 */
async function initFirebase(): Promise<void> {
  if (firebaseApp) return;

  // Dynamically import Firebase modules
  const [{ initializeApp, getApps, getApp }, { getAuth }, { getFirestore }] =
    await Promise.all([
      import("firebase/app"),
      import("firebase/auth"),
      import("firebase/firestore"),
    ]);

  // Initialize app (reuse existing if available)
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);
}

/**
 * Get Firebase Auth instance (lazy loaded)
 */
export async function getFirebaseAuth(): Promise<Auth> {
  if (!initPromise) {
    initPromise = initFirebase();
  }
  await initPromise;
  return firebaseAuth!;
}

/**
 * Get Firestore instance (lazy loaded)
 */
export async function getFirebaseDb(): Promise<Firestore> {
  if (!initPromise) {
    initPromise = initFirebase();
  }
  await initPromise;
  return firebaseDb!;
}

/**
 * Get Firebase App instance (lazy loaded)
 */
export async function getFirebaseApp(): Promise<FirebaseApp> {
  if (!initPromise) {
    initPromise = initFirebase();
  }
  await initPromise;
  return firebaseApp!;
}

/**
 * Check if Firebase is already initialized
 */
export function isFirebaseInitialized(): boolean {
  return firebaseApp !== null;
}
