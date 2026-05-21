"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

type Props = {
  onContinueWithGoogle: () => void;
};

// ─── Icons ───────────────────────────────────────────────────────────

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect width="24" height="24" rx="5" fill="#2563EB" />
      <path
        d="M12 5C9.4 8 7.5 11 7.5 14a4.5 4.5 0 0 0 9 0c0-3-1.9-6-4.5-9z"
        fill="#fff"
      />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
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

function DropletIcon({ className }: { className?: string }) {
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

function ScanIcon({ className }: { className?: string }) {
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
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
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
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
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
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// ─── Navigation ──────────────────────────────────────────────────────

function Nav({ onContinueWithGoogle }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Drip
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100"
          >
            Home
          </Link>
          <a
            href="#features"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            Features
          </a>
          <Link
            href="/pricing"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            About
          </Link>
          <Link
            href="/ai-detector"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            AI Detector
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onContinueWithGoogle}
            className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 sm:block"
          >
            Log in
          </button>
          <button
            onClick={onContinueWithGoogle}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero with Interactive Demo ──────────────────────────────────────

function Hero({ onContinueWithGoogle }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            100% Free to Use
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Drip your writing into
            <br />
            <span className="text-blue-600">Google Docs</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Schedule content delivery, detect AI-generated text, and humanize
            your writing. Three powerful tools in one platform.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                trackEvent("cta_click", { button: "hero_start_free" });
                onContinueWithGoogle();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
            >
              <GoogleIcon className="h-5 w-5" />
              Start for free
            </button>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50"
            >
              See features
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required. Sign in with Google.
          </p>
        </div>

        {/* Interactive Demo */}
        <div className="mt-16">
          <DripDemo onSignUp={onContinueWithGoogle} />
        </div>
      </div>
    </section>
  );
}

// ─── Interactive Drip Demo ───────────────────────────────────────────

function DripDemo({ onSignUp }: { onSignUp: () => void }) {
  const fullText = [
    "The morning sun cast long shadows across the empty street.",
    "Sarah pulled her coat tighter against the autumn chill.",
    "She had been walking for what felt like hours.",
    "The café on the corner was finally in sight.",
    "Its warm glow promised refuge from the cold.",
  ];

  const [visibleSentences, setVisibleSentences] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    if (visibleSentences >= 2) {
      setIsRunning(false);
      setShowSignupPrompt(true);
      return;
    }

    const timer = setTimeout(() => {
      setVisibleSentences((v) => v + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isRunning, visibleSentences]);

  function handleStart() {
    setVisibleSentences(0);
    setShowSignupPrompt(false);
    setIsRunning(true);
    trackEvent("demo_started");
  }

  function handleSignUp() {
    trackEvent("demo_signup_clicked");
    onSignUp();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-100/50">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="ml-4 flex-1 rounded-lg bg-gray-100 px-4 py-1.5 text-xs text-gray-500">
            docs.google.com/document/d/your-document
          </div>
        </div>

        {/* Document area */}
        <div className="mt-4 min-h-[200px] rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="mb-3 text-sm font-medium text-gray-400">
            My Story Draft
          </div>
          <div className="space-y-2">
            {fullText.slice(0, visibleSentences + 1).map((sentence, i) => (
              <p
                key={i}
                className={`text-sm text-gray-700 transition-opacity duration-500 ${
                  i === visibleSentences && isRunning
                    ? "animate-pulse"
                    : "opacity-100"
                }`}
              >
                {sentence}
              </p>
            ))}
            {isRunning && (
              <span className="inline-block h-4 w-0.5 animate-pulse bg-blue-500" />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Duration:</span>
            {["30 min", "1 hr", "2 hrs"].map((d, i) => (
              <span
                key={d}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  i === 1
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 text-gray-600"
                }`}
              >
                {d}
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-500">
            {visibleSentences + 1} / {fullText.length} sentences
          </div>
        </div>

        {/* Signup prompt overlay */}
        {showSignupPrompt && (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
            <p className="text-sm font-medium text-gray-900">
              Sign up to continue dripping your content
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Create realistic version history in Google Docs
            </p>
            <button
              onClick={handleSignUp}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <GoogleIcon className="h-4 w-4" />
              Continue with Google
            </button>
          </div>
        )}

        {/* Start button */}
        {!isRunning && !showSignupPrompt && (
          <button
            onClick={handleStart}
            className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try Demo
          </button>
        )}

        {isRunning && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-600">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeOpacity="0.25"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            Dripping content...
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Features Section ────────────────────────────────────────────────

function Features() {
  const features = [
    {
      icon: DropletIcon,
      title: "Drip Writing",
      description:
        "Schedule your content to appear in Google Docs over time. Set custom durations from 30 minutes to a full week. Perfect for creating realistic version history.",
      color: "blue",
      benefits: [
        "Create realistic writing timelines",
        "Schedule content delivery",
        "Import .txt, .md, .docx, .pdf",
        "Preserve formatting",
      ],
    },
    {
      icon: ScanIcon,
      title: "AI Detection",
      description:
        "Detect AI-generated content with 99% accuracy. Our sentence-level highlighting shows you exactly which parts might be flagged by AI detectors.",
      color: "purple",
      benefits: [
        "99% detection accuracy",
        "Sentence-level analysis",
        "Color-coded highlighting",
        "Detailed explanations",
      ],
    },
    {
      icon: SparklesIcon,
      title: "Text Humanization",
      description:
        "Transform AI-generated text to sound more natural and authentic. Preserve your original meaning while adjusting the style to match human writing patterns.",
      color: "emerald",
      benefits: [
        "Natural-sounding output",
        "Preserves meaning",
        "Bypasses AI detection",
        "One-click rewriting",
      ],
    },
  ];

  const colors = {
    blue: {
      bg: "bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
      check: "text-blue-600",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "bg-purple-100 text-purple-600",
      check: "text-purple-600",
    },
    emerald: {
      bg: "bg-emerald-50",
      icon: "bg-emerald-100 text-emerald-600",
      check: "text-emerald-600",
    },
  };

  return (
    <section id="features" className="border-t border-gray-100 bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Features
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Three powerful tools, one platform
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Everything you need to manage your writing workflow, from scheduling
            to AI detection and humanization.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {features.map((feature) => {
            const colorClasses = colors[feature.color as keyof typeof colors];
            return (
              <div
                key={feature.title}
                className={`rounded-2xl border border-gray-100 p-8 ${colorClasses.bg}`}
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses.icon}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2">
                      <CheckIcon className={`h-4 w-4 ${colorClasses.check}`} />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Sign in with Google",
      body: "Connect your Google account securely. We only access documents the app creates.",
    },
    {
      n: "02",
      title: "Write or import",
      body: "Type in the editor or import .txt, .md, .docx, or .pdf files. All formatting is preserved.",
    },
    {
      n: "03",
      title: "Choose your tool",
      body: "Drip content to Docs, scan for AI, or humanize text. All tools are free to use.",
    },
  ];

  return (
    <section className="border-t border-gray-100 bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            How it works
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Get started in three steps
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {step.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────

function CtaBanner({ onContinueWithGoogle }: Props) {
  return (
    <section className="border-t border-gray-100 bg-white py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ready to get started?
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Join thousands of writers using Drip. Free forever, no credit card
          required.
        </p>
        <button
          onClick={onContinueWithGoogle}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
        >
          <GoogleIcon className="h-5 w-5" />
          Get Started Free
        </button>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon className="h-7 w-7" />
          <span className="text-base font-semibold text-gray-900">Drip</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <Link href="/pricing" className="hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-gray-900">
            About
          </Link>
          <Link href="/ai-detector" className="hover:text-gray-900">
            AI Detector
          </Link>
          <Link href="/privacy" className="hover:text-gray-900">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-gray-900">
            Terms
          </Link>
        </nav>
        <p className="text-sm text-gray-400">&copy; 2026 Drip</p>
      </div>
    </footer>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────

export default function Landing({ onContinueWithGoogle }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <Nav onContinueWithGoogle={onContinueWithGoogle} />
      <Hero onContinueWithGoogle={onContinueWithGoogle} />
      <Features />
      <HowItWorks />
      <CtaBanner onContinueWithGoogle={onContinueWithGoogle} />
      <Footer />
    </div>
  );
}
