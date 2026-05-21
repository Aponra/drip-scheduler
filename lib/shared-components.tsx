"use client";

import Link from "next/link";

// ─── Logo ─────────────────────────────────────────────────────────────
// Use this same logo component everywhere for consistency

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <rect width="24" height="24" rx="5" fill="#10B981" />
        <path
          d="M12 5C9.4 8 7.5 11 7.5 14a4.5 4.5 0 0 0 9 0c0-3-1.9-6-4.5-9z"
          fill="#fff"
        />
      </svg>
      <span className={`text-lg font-bold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
        Drip
      </span>
    </Link>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────

type NavProps = {
  onGetStarted?: () => void;
  currentPage?: string;
  dark?: boolean;
};

export function Nav({ onGetStarted, currentPage, dark = false }: NavProps) {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/ai-detector", label: "AI Detector" },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b ${dark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo dark={dark} />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                currentPage === link.label
                  ? dark
                    ? "text-white bg-gray-800"
                    : "text-gray-900 bg-gray-100"
                  : dark
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {onGetStarted ? (
            <>
              <button
                onClick={onGetStarted}
                className={`hidden text-sm font-medium transition-colors sm:block ${
                  dark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Log in
              </button>
              <button
                onClick={onGetStarted}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
              >
                Get Started
              </button>
            </>
          ) : (
            <Link
              href="/"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────

export function Footer({ dark = false }: { dark?: boolean }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/ai-detector", label: "AI Detector" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ];

  return (
    <footer className={`border-t py-10 ${dark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}`}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <Logo dark={dark} />
        <nav className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${dark ? "hover:text-white" : "hover:text-gray-900"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>
          &copy; 2026 Drip
        </p>
      </div>
    </footer>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
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

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function DropletIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

export function ScanIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
      <path d="M7 8h6" />
      <path d="M7 16h8" />
    </svg>
  );
}

export function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
      <path d="M19 13l1 2 1-2 2-1-2-1-1-2-1 2-2 1 2 1z" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
