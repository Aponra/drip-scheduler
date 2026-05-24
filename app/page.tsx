"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Landing from "./landing";

export default function Home() {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div
          aria-label="Loading"
          className="h-6 w-6 rounded-full border-2 border-gray-700 border-t-purple-500 animate-spin"
        />
      </div>
    );
  }

  // Show landing for logged-in users while redirecting
  if (user) {
    return (
      <Landing
        onContinueWithGoogle={() => router.push("/dashboard")}
        isLoggedIn={true}
        onGoToDashboard={() => router.push("/dashboard")}
      />
    );
  }

  return (
    <Landing
      onContinueWithGoogle={() => {
        signInWithGoogle().catch((err) => console.error(err));
      }}
    />
  );
}
