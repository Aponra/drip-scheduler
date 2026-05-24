"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import HeroClient from "./components/hero-client";
import { trackCtaClick } from "@/lib/analytics";

// Lazy load below-fold sections - reduces initial bundle significantly
const BelowFoldSections = dynamic(() => import("./components/below-fold-sections"), {
  ssr: false,
  loading: () => <div className="min-h-[200px]" />,
});

type Props = {
  onContinueWithGoogle: () => void;
};

// Inline SVG icons for above-fold content (avoids Lucide bundle in critical path)
function DropletIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
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
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// ─── Announcement Bar ────────────────────────────────────────────────

function AnnouncementBar() {
  return (
    <div className="bg-emerald-600 text-white py-2.5 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 text-sm">
        <span className="bg-white/30 text-white text-xs font-semibold px-2 py-0.5 rounded">
          NEW
        </span>
        <span className="text-white">
          Now supports PDF imports with formatting
        </span>
        <ArrowRightIcon className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────

function Navbar({ onGetStarted }: { onGetStarted: () => void }) {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "AI Detector", href: "/ai-detector" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <DropletIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">
            Docs Version History
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              trackCtaClick({ cta_id: "navbar-login", cta_text: "Log in", location: "navbar" });
              onGetStarted();
            }}
            className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => {
              trackCtaClick({ cta_id: "navbar-get-started", cta_text: "Get Started", location: "navbar" });
              onGetStarted();
            }}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-500 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────
// No animation delays on LCP elements for faster paint

function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="pt-16 pb-24 px-6" aria-labelledby="hero-heading">
      <div className="max-w-5xl mx-auto text-center">
        {/* LCP element - render immediately, no animation delay */}
        <h1
          id="hero-heading"
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1]"
        >
          Add Version History to
          <br />
          <span className="text-emerald-400">Your Google Docs</span>
        </h1>

        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Create realistic document revision history by gradually adding text to Google Docs over time.
          Track writing progress and build authentic version history automatically.
        </p>

        {/* Interactive Hero Box */}
        <HeroClient onGetStarted={onGetStarted} />

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-500">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">100% Free</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">No credit card</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">Creates real version history</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Landing Component ──────────────────────────────────────────

export default function Landing({ onContinueWithGoogle }: Props) {
  return (
    <div className="min-h-screen bg-gray-950">
      <AnnouncementBar />
      <Navbar onGetStarted={onContinueWithGoogle} />
      <main id="main-content">
        <Hero onGetStarted={onContinueWithGoogle} />
        {/* Below fold sections lazy loaded for better initial load */}
        <BelowFoldSections onGetStarted={onContinueWithGoogle} />
      </main>
    </div>
  );
}
