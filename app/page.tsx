"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Scheduler from "./scheduler";

const DOCS_CONNECTED_KEY = "googleDocsConnected";

function DocsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 3c3 4.5 5.5 7.5 5.5 11a5.5 5.5 0 1 1-11 0c0-3.5 2.5-6.5 5.5-11z" />
    </svg>
  );
}

function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.06-1.36-.18-2H12v3.79h5.39a4.6 4.6 0 0 1-2 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.32z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.23-2.51c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.59-4.13H3.07v2.6A10 10 0 0 0 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.89A6 6 0 0 1 6.09 12c0-.66.11-1.3.32-1.89V7.51H3.07a10 10 0 0 0 0 8.98l3.34-2.6z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 3.04 14.7 2.16 12 2.16A10 10 0 0 0 3.07 7.51l3.34 2.6C7.2 7.74 9.4 5.98 12 5.98z"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

type Toast = { kind: "success" | "warning" | "error"; message: string };

export default function Home() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [docsConnected, setDocsConnected] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Optimistic hint while we wait for /status to confirm.
    if (window.localStorage.getItem(DOCS_CONNECTED_KEY) === "1") {
      setDocsConnected(true);
    }

    const params = new URLSearchParams(window.location.search);
    const status = params.get("googleDocs");
    if (status) {
      if (status === "connected") {
        setToast({
          kind: "success",
          message: "Google Docs connected successfully",
        });
      } else if (status === "denied") {
        // Permission denied -> definitively NOT connected.
        window.localStorage.removeItem(DOCS_CONNECTED_KEY);
        setDocsConnected(false);
        setToast({
          kind: "warning",
          message:
            "Google Docs permission was denied. Please connect again and approve the requested permissions.",
        });
      } else if (status === "error") {
        window.localStorage.removeItem(DOCS_CONNECTED_KEY);
        setDocsConnected(false);
        const reason = params.get("reason");
        setToast({
          kind: "error",
          message: reason
            ? `Google Docs connection failed: ${reason}`
            : "Google Docs connection failed. Please try connecting again.",
        });
      }

      params.delete("googleDocs");
      params.delete("reason");
      const remaining = params.toString();
      const cleaned =
        window.location.pathname + (remaining ? `?${remaining}` : "");
      window.history.replaceState({}, "", cleaned);
    }

    // Server is the source of truth. Confirm against /api/google-docs/status.
    let cancelled = false;
    fetch("/api/google-docs/status", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { connected?: boolean } | null) => {
        if (cancelled) return;
        const connected = Boolean(data?.connected);
        setDocsConnected(connected);
        if (connected) {
          window.localStorage.setItem(DOCS_CONNECTED_KEY, "1");
        } else {
          window.localStorage.removeItem(DOCS_CONNECTED_KEY);
        }
      })
      .catch(() => {
        // Network/server error: don't promote to connected from a stale hint.
        if (cancelled) return;
        setDocsConnected(false);
        window.localStorage.removeItem(DOCS_CONNECTED_KEY);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    if (toast.kind === "success") {
      const id = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(id);
    }
    // warning/error toasts persist until dismissed manually
  }, [toast]);

  async function handleLogout() {
    try {
      window.localStorage.removeItem(DOCS_CONNECTED_KEY);
    } catch {
      // localStorage may be unavailable; ignore
    }
    setDocsConnected(false);
    await logout();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          aria-label="Loading"
          className="h-6 w-6 rounded-full border-2 border-gray-200 border-t-indigo-600 animate-spin"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative isolate min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-b from-indigo-50/70 via-white to-violet-50/60">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 shadow-xl shadow-indigo-100/40 ring-1 ring-black/[0.02] animate-fade-in-up">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
              <LogoIcon className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900">
              Drip Scheduler
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Schedule prose, drip it on an interval, save it for later, and
              export to Google Docs.
            </p>
          </div>

          <button
            onClick={() => {
              signInWithGoogle().catch((err) => console.error(err));
            }}
            className="group mt-7 inline-flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <GoogleGIcon className="h-5 w-5" />
            Continue with Google
          </button>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <ul className="space-y-3">
              {[
                {
                  label: "Drip text slowly",
                  Icon: ClockIcon,
                  delay: "100ms",
                },
                {
                  label: "Save schedules",
                  Icon: BookmarkIcon,
                  delay: "180ms",
                },
                {
                  label: "Export to Google Docs",
                  Icon: DocsIcon,
                  delay: "260ms",
                },
              ].map(({ label, Icon, delay }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 animate-fade-in-up"
                  style={{ animationDelay: delay }}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-gray-700">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {toast && (
        <div
          role={toast.kind === "success" ? "status" : "alert"}
          className="fixed left-1/2 top-4 z-30 -translate-x-1/2 animate-fade-in-up px-4 max-w-[calc(100vw-2rem)]"
        >
          <div
            className={
              toast.kind === "success"
                ? "flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-white px-4 py-2.5 shadow-md"
                : toast.kind === "warning"
                  ? "flex items-start gap-2.5 rounded-lg border border-amber-200 bg-white px-4 py-2.5 shadow-md"
                  : "flex items-start gap-2.5 rounded-lg border border-red-200 bg-white px-4 py-2.5 shadow-md"
            }
          >
            <span
              className={
                toast.kind === "success"
                  ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                  : toast.kind === "warning"
                    ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"
                    : "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700"
              }
            >
              {toast.kind === "success" ? (
                <CheckIcon className="h-3.5 w-3.5" />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                >
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </svg>
              )}
            </span>
            <span className="text-sm font-medium text-gray-800">
              {toast.message}
            </span>
            {toast.kind !== "success" && (
              <button
                onClick={() => setToast(null)}
                aria-label="Dismiss"
                className="-mr-1 ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile top bar (< lg) */}
      <header className="lg:hidden sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-purple-600" />
            <span className="text-sm font-semibold tracking-tight text-gray-900">
              Drip Scheduler
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/google-docs/auth"
              aria-label={
                docsConnected
                  ? "Connected to Google Docs"
                  : "Connect Google Docs"
              }
              className={
                docsConnected
                  ? "inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition-all hover:bg-emerald-100"
                  : "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
              }
            >
              {docsConnected ? (
                <CheckIcon className="h-3.5 w-3.5" />
              ) : (
                <DocsIcon className="h-3.5 w-3.5 text-purple-600" />
              )}
              <span className="hidden sm:inline">
                {docsConnected ? "Connected" : "Connect"}
              </span>
            </a>
            <button
              onClick={() => {
                handleLogout().catch((err) => console.error(err));
              }}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (lg+) */}
        <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center gap-2.5 px-6 border-b border-gray-100">
            <div className="h-2.5 w-2.5 rounded-full bg-purple-600" />
            <span className="text-base font-semibold tracking-tight text-gray-900">
              Drip Scheduler
            </span>
          </div>

          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              <li>
                <span
                  aria-current="page"
                  className="flex items-center gap-2.5 rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-4 w-4"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                  New schedule
                </span>
              </li>
            </ul>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Integrations
              </p>
              <a
                href="/api/google-docs/auth"
                aria-label={
                  docsConnected
                    ? "Connected to Google Docs"
                    : "Connect Google Docs"
                }
                className={
                  docsConnected
                    ? "mt-2 flex w-full items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 shadow-sm transition-all hover:-translate-y-px hover:bg-emerald-100 hover:shadow"
                    : "mt-2 flex w-full items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-50 hover:shadow"
                }
              >
                {docsConnected ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <DocsIcon className="h-4 w-4 text-purple-600" />
                )}
                <span className="truncate">
                  {docsConnected
                    ? "Connected to Google Docs"
                    : "Connect Google Docs"}
                </span>
              </a>
            </div>
          </nav>

          <div className="border-t border-gray-100 p-4">
            <p
              className="truncate text-xs text-gray-500"
              title={user.email ?? undefined}
            >
              {user.email ?? user.displayName ?? "Signed in"}
            </p>
            <button
              onClick={() => {
                handleLogout().catch((err) => console.error(err));
              }}
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
            >
              Log out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="relative flex-1 overflow-x-hidden">
          {/* Soft pink/purple glow accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-fuchsia-200/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 left-[-5%] h-[320px] w-[320px] rounded-full bg-purple-200/25 blur-3xl"
          />

          <div className="relative mx-auto w-full max-w-3xl px-6 py-10 lg:py-12">
            <div className="mb-8 animate-fade-in-up">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                Insert Text
              </h1>
              <p className="mt-1.5 text-sm text-gray-500">
                Plan a drip, save it for later, or send it slowly into Google
                Docs.
              </p>
            </div>
            <Scheduler docsConnected={docsConnected} />
          </div>
        </main>
      </div>
    </div>
  );
}
