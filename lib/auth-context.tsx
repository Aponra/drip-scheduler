"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
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
  const [authInitialized, setAuthInitialized] = useState(false);

  // Check for auth hint in session storage (fast, no Firebase needed)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hint = sessionStorage.getItem(AUTH_HINT_KEY);

    // If no hint of previous auth, user is likely not logged in
    // Show content immediately without waiting for Firebase
    if (!hint) {
      setLoading(false);
      return;
    }

    // User was previously authenticated, initialize Firebase to verify
    initializeAuth();
  }, []);

  // Initialize Firebase auth and set up listener
  const initializeAuth = useCallback(async () => {
    if (authInitialized) return;

    try {
      const auth = await getFirebaseAuth();
      const { onAuthStateChanged } = await import("firebase/auth");

      setAuthInitialized(true);

      const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser);
        setLoading(false);

        // Update session hint
        if (nextUser) {
          sessionStorage.setItem(AUTH_HINT_KEY, "1");
        } else {
          sessionStorage.removeItem(AUTH_HINT_KEY);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error("Failed to initialize Firebase auth:", error);
      setLoading(false);
    }
  }, [authInitialized]);

  // Sign in with Google - this is when Firebase actually loads
  const signInWithGoogle = useCallback(async () => {
    setLoading(true);

    try {
      const auth = await getFirebaseAuth();
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");

      // Set up auth listener if not already done
      if (!authInitialized) {
        await initializeAuth();
      }

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // Track sign-up vs login based on whether this is a new user
      const isNewUser =
        userCredential.user.metadata.creationTime ===
        userCredential.user.metadata.lastSignInTime;

      if (isNewUser) {
        trackSignUp("google");
      } else {
        trackLogin("google");
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      setLoading(false);
      throw error;
    }
  }, [authInitialized, initializeAuth]);

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
