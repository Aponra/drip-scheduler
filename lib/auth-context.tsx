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

  // Initialize Firebase auth, check redirect result, and set up listener
  const initializeAuth = useCallback(async () => {
    if (authInitializedRef.current) return;

    try {
      const auth = await getFirebaseAuth();
      const { onAuthStateChanged, getRedirectResult } = await import("firebase/auth");

      authInitializedRef.current = true;

      // Always check for redirect result first
      try {
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
      } catch (redirectError) {
        // Redirect result errors are not critical, log and continue
        console.error("Redirect result check failed:", redirectError);
      }

      // Set up auth state listener
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

  // Check auth on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hint = sessionStorage.getItem(AUTH_HINT_KEY);

    // If user was previously logged in OR if we might be returning from a redirect,
    // initialize Firebase to check auth state
    // We check the URL for any signs of OAuth callback
    const isOAuthCallback = window.location.href.includes("apiKey") ||
                            window.location.href.includes("authUser") ||
                            document.referrer.includes("accounts.google.com");

    if (hint || isOAuthCallback) {
      initializeAuth();
    } else {
      // No hint of auth, but still initialize to catch redirect results
      // Use a slight delay to not block initial render
      const timer = setTimeout(() => {
        initializeAuth();
      }, 100);

      // Show content immediately for non-authenticated users
      setLoading(false);

      return () => clearTimeout(timer);
    }
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

      // Set hint that user is attempting to auth
      sessionStorage.setItem(AUTH_HINT_KEY, "pending");

      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
      // Note: This will redirect away from the page
    } catch (error) {
      console.error("Sign in failed:", error);
      sessionStorage.removeItem(AUTH_HINT_KEY);
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
