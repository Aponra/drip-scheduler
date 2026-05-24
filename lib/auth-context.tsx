"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { getFirebaseAuth, isFirebaseInitialized } from "./firebase-lazy";
import { trackSignUp, trackLogin } from "./analytics";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Session storage key for quick auth state hint
const AUTH_HINT_KEY = "authHint";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authInitializedRef = useRef(false);

  // Initialize Firebase auth and set up listener
  const initializeAuth = useCallback(async () => {
    if (authInitializedRef.current) return;

    try {
      const auth = await getFirebaseAuth();
      const { onAuthStateChanged, getRedirectResult } = await import("firebase/auth");

      authInitializedRef.current = true;

      // Check for redirect result (in case user used redirect flow)
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const isNewUser =
            result.user.metadata.creationTime ===
            result.user.metadata.lastSignInTime;

          if (isNewUser) {
            trackSignUp("google");
          } else {
            trackLogin("google");
          }
        }
      } catch (e) {
        // Ignore redirect errors
      }

      // Set up auth state listener
      onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser);
        setLoading(false);

        if (nextUser) {
          sessionStorage.setItem(AUTH_HINT_KEY, "1");
        } else {
          sessionStorage.removeItem(AUTH_HINT_KEY);
        }
      });
    } catch (error) {
      console.error("Failed to initialize Firebase auth:", error);
      setLoading(false);
    }
  }, []);

  // Always initialize auth on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    initializeAuth();
  }, [initializeAuth]);

  // Sign in with Google - try popup first, fall back to redirect
  const signInWithGoogle = useCallback(async () => {
    setLoading(true);

    try {
      const auth = await getFirebaseAuth();
      const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = await import("firebase/auth");

      if (!authInitializedRef.current) {
        await initializeAuth();
      }

      const provider = new GoogleAuthProvider();

      try {
        // Try popup first (better UX)
        const result = await signInWithPopup(auth, provider);

        if (result?.user) {
          const isNewUser =
            result.user.metadata.creationTime ===
            result.user.metadata.lastSignInTime;

          if (isNewUser) {
            trackSignUp("google");
          } else {
            trackLogin("google");
          }
        }
      } catch (popupError: any) {
        // If popup was blocked, fall back to redirect
        if (popupError?.code === "auth/popup-blocked" ||
            popupError?.code === "auth/popup-closed-by-user" ||
            popupError?.code === "auth/cancelled-popup-request") {
          console.log("Popup blocked, using redirect flow...");
          sessionStorage.setItem(AUTH_HINT_KEY, "pending");
          await signInWithRedirect(auth, provider);
        } else {
          throw popupError;
        }
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      setLoading(false);
      throw error;
    }
  }, [initializeAuth]);

  // Logout
  const logout = useCallback(async () => {
    if (!isFirebaseInitialized()) {
      setUser(null);
      sessionStorage.removeItem(AUTH_HINT_KEY);
      return;
    }

    try {
      const auth = await getFirebaseAuth();
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
      sessionStorage.removeItem(AUTH_HINT_KEY);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
