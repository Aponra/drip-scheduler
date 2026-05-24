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
// Key to track if we're expecting a redirect result
const REDIRECT_PENDING_KEY = "authRedirectPending";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authInitializedRef = useRef(false);

  // Initialize Firebase auth and set up listener
  const initializeAuth = useCallback(async () => {
    if (authInitializedRef.current) return;

    try {
      const auth = await getFirebaseAuth();
      const { onAuthStateChanged } = await import("firebase/auth");

      authInitializedRef.current = true;

      onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser);
        setLoading(false);

        // Update session hint
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

  // Check for redirect result or auth hint on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAuth = async () => {
      const redirectPending = sessionStorage.getItem(REDIRECT_PENDING_KEY);

      // If redirect is pending, check for the result
      if (redirectPending) {
        try {
          const auth = await getFirebaseAuth();
          const { getRedirectResult } = await import("firebase/auth");

          // Clear the pending flag
          sessionStorage.removeItem(REDIRECT_PENDING_KEY);

          const result = await getRedirectResult(auth);

          if (result?.user) {
            // Track sign-up vs login based on whether this is a new user
            const isNewUser =
              result.user.metadata.creationTime ===
              result.user.metadata.lastSignInTime;

            if (isNewUser) {
              trackSignUp("google");
            } else {
              trackLogin("google");
            }
          }

          // Initialize auth listener
          await initializeAuth();
        } catch (error) {
          console.error("Failed to get redirect result:", error);
          sessionStorage.removeItem(REDIRECT_PENDING_KEY);
          setLoading(false);
        }
        return;
      }

      const hint = sessionStorage.getItem(AUTH_HINT_KEY);

      // If no hint of previous auth, user is likely not logged in
      // Show content immediately without waiting for Firebase
      if (!hint) {
        setLoading(false);
        return;
      }

      // User was previously authenticated, initialize Firebase to verify
      await initializeAuth();
    };

    checkAuth();
  }, [initializeAuth]);

  // Sign in with Google - uses redirect flow to avoid popup blockers
  const signInWithGoogle = useCallback(async () => {
    setLoading(true);

    try {
      const auth = await getFirebaseAuth();
      const { GoogleAuthProvider, signInWithRedirect } = await import("firebase/auth");

      // Set up auth listener if not already done
      if (!authInitializedRef.current) {
        await initializeAuth();
      }

      // Mark that we're expecting a redirect result
      sessionStorage.setItem(REDIRECT_PENDING_KEY, "1");

      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
      // Note: This will redirect away from the page, tracking happens on return
    } catch (error) {
      console.error("Sign in failed:", error);
      sessionStorage.removeItem(REDIRECT_PENDING_KEY);
      setLoading(false);
      throw error;
    }
  }, [initializeAuth]);

  // Logout
  const logout = useCallback(async () => {
    if (!isFirebaseInitialized()) {
      // Not signed in, nothing to do
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
