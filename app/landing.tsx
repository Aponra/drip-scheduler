"use client";

import { useState, useEffect, useRef } from "react";
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

function GoogleGIcon({ className }: { className?: string }) {
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
      <path d="M7 8h6" />
      <path d="M7 16h8" />
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
      <path d="M19 13l1 2 1-2 2-1-2-1-1-2-1 2-2 1 2 1z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M8 5v14l11-7z" />
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

function CheckCircleIcon({ className }: { className?: string }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}

// ─── Navigation ──────────────────────────────────────────────────────

function Nav({ onContinueWithGoogle }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Drip
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <a
            href="#features"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Features
          </a>
          <a
            href="#demo"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Demo
          </a>
          <Link
            href="/ai-detector"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            AI Detector
          </Link>
          <a
            href="#faq"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            FAQ
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onContinueWithGoogle}
            className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:block"
          >
            Log in
          </button>
          <button
            onClick={() => {
              trackEvent("cta_click", {
                button_name: "get_started_nav",
                location: "navbar",
              });
              onContinueWithGoogle();
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────

function Hero({ onContinueWithGoogle }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-100/60 via-purple-100/40 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 lg:pb-28 lg:pt-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            Free to use — No credit card required
          </div>

          {/* Headline */}
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Stream your writing into
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Google Docs{" "}
            </span>
            on your schedule
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Drip your content over minutes, hours, or days. Detect AI-generated text.
            Humanize your writing. All in one powerful tool.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                trackEvent("cta_click", {
                  button_name: "start_free_hero",
                  location: "hero",
                });
                onContinueWithGoogle();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
            >
              <GoogleGIcon className="h-5 w-5" />
              Start Free with Google
            </button>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              <PlayIcon className="h-5 w-5" />
              See Demo
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
              No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
              Works with Google Docs
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
              Cancel anytime
            </span>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="mx-auto mt-16 flex max-w-3xl flex-wrap justify-center gap-3">
          {[
            { icon: DropletIcon, label: "Drip Writing", color: "blue" },
            { icon: ScanIcon, label: "AI Detection", color: "purple" },
            { icon: SparklesIcon, label: "Humanize Text", color: "emerald" },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 rounded-full border bg-white px-5 py-2.5 shadow-sm transition-all hover:shadow-md ${
                item.color === "blue"
                  ? "border-blue-200 text-blue-700"
                  : item.color === "purple"
                    ? "border-purple-200 text-purple-700"
                    : "border-emerald-200 text-emerald-700"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Interactive Demo ────────────────────────────────────────────────

function InteractiveDemo({ onContinueWithGoogle }: Props) {
  const [demoText, setDemoText] = useState(
    "The morning sun cast long shadows across the valley. Birds began their daily chorus as the first light touched the mountain peaks. It was going to be a beautiful day."
  );
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState("30s");
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sentences = demoText.match(/[^.!?]+[.!?]+/g) || [demoText];

  const durations = [
    { key: "30s", label: "30 sec", seconds: 30 },
    { key: "1m", label: "1 min", seconds: 60 },
    { key: "5m", label: "5 min", seconds: 300 },
  ];

  const selectedSeconds = durations.find((d) => d.key === selectedDuration)?.seconds || 30;
  const intervalMs = (selectedSeconds / Math.max(sentences.length, 1)) * 1000;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function startDemo() {
    if (sentences.length === 0) return;

    // Show signup prompt after 2 sentences
    setIsRunning(true);
    setCurrentIndex(1);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= 2) {
          // Stop after 2 sentences and show signup
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsRunning(false);
          setShowSignupPrompt(true);
          return prev;
        }
        return prev + 1;
      });
    }, Math.min(intervalMs, 2000)); // Cap at 2 seconds for demo
  }

  function resetDemo() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setCurrentIndex(0);
    setShowSignupPrompt(false);
  }

  return (
    <section id="demo" className="border-t border-gray-100 bg-gray-50/50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Live Demo
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            See dripping in action
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Try the demo below to see how your text gets streamed into Google Docs.
            Sign up to unlock the full experience.
          </p>
        </div>

        <div className="relative mt-10">
          {/* Demo Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 lg:p-8">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="ml-4 flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs text-gray-500">
                docs.google.com/document/d/demo
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Input side */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Your Text
                </label>
                <textarea
                  value={demoText}
                  onChange={(e) => {
                    setDemoText(e.target.value);
                    resetDemo();
                  }}
                  disabled={isRunning}
                  rows={6}
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition-all focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                {/* Duration selector */}
                <div className="mt-4">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Duration
                  </label>
                  <div className="mt-2 flex gap-2">
                    {durations.map((d) => (
                      <button
                        key={d.key}
                        onClick={() => setSelectedDuration(d.key)}
                        disabled={isRunning}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                          selectedDuration === d.key
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start button */}
                <button
                  onClick={isRunning ? resetDemo : startDemo}
                  className={`mt-4 w-full rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                    isRunning
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
                  }`}
                >
                  {isRunning ? "Stop Demo" : "Start Dripping"}
                </button>
              </div>

              {/* Output side (Google Doc preview) */}
              <div className="relative">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Google Doc Output
                </label>
                <div className="mt-2 min-h-[200px] rounded-xl border border-gray-200 bg-white p-4">
                  {currentIndex === 0 ? (
                    <p className="text-sm italic text-gray-400">
                      Click &quot;Start Dripping&quot; to see your text appear here...
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {sentences.slice(0, currentIndex).map((sentence, i) => (
                        <p
                          key={i}
                          className="animate-fade-in-up text-sm text-gray-700"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          {sentence.trim()}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress */}
                {currentIndex > 0 && (
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Progress: {currentIndex} / {sentences.length} sentences
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      {isRunning ? "Dripping..." : "Paused"}
                    </span>
                  </div>
                )}

                {/* Signup Prompt Overlay */}
                {showSignupPrompt && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/95 backdrop-blur-sm">
                    <div className="text-center p-6">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                        <DropletIcon className="h-7 w-7 text-blue-600" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-gray-900">
                        Sign up to continue
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Create a free account to drip your full text into Google Docs.
                      </p>
                      <button
                        onClick={() => {
                          trackEvent("cta_click", {
                            button_name: "signup_demo_prompt",
                            location: "demo",
                          });
                          onContinueWithGoogle();
                        }}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700"
                      >
                        <GoogleGIcon className="h-4 w-4" />
                        Continue with Google
                      </button>
                      <button
                        onClick={resetDemo}
                        className="mt-3 block w-full text-sm text-gray-500 hover:text-gray-700"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ────────────────────────────────────────────────

function Features({ onContinueWithGoogle }: Props) {
  const features = [
    {
      icon: DropletIcon,
      title: "Drip Writing",
      color: "blue",
      description:
        "Schedule your content to appear in Google Docs over time. Perfect for simulating real-time writing, pacing deliveries, or creating version history.",
      benefits: [
        "Stream text over minutes, hours, or days",
        "Customizable chunk sizes and intervals",
        "Preserves formatting (bold, headings, lists)",
        "Import from .txt, .md, .docx, or .pdf",
        "Save and resume schedules anytime",
      ],
    },
    {
      icon: ScanIcon,
      title: "AI Detection",
      color: "purple",
      description:
        "Detect AI-generated content with sentence-level highlighting. Know exactly which parts of your text might be flagged as AI-written.",
      benefits: [
        "99% detection accuracy",
        "Sentence-by-sentence analysis",
        "Color-coded highlighting",
        "Confidence scores for each section",
        "Works with any text length",
      ],
    },
    {
      icon: SparklesIcon,
      title: "Text Humanization",
      color: "emerald",
      description:
        "Transform AI-generated text to sound more natural and human. Bypass AI detectors while maintaining your original meaning.",
      benefits: [
        "Natural language transformation",
        "Preserves original meaning",
        "Multiple rewriting styles",
        "One-click copy to clipboard",
        "Instant results",
      ],
    },
  ];

  const colorStyles = {
    blue: {
      bg: "bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
      border: "border-blue-100",
      check: "text-blue-500",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "bg-purple-100 text-purple-600",
      border: "border-purple-100",
      check: "text-purple-500",
    },
    emerald: {
      bg: "bg-emerald-50",
      icon: "bg-emerald-100 text-emerald-600",
      border: "border-emerald-100",
      check: "text-emerald-500",
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
            Everything you need in one place
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Three powerful tools to help you manage, detect, and improve your writing.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {features.map((feature) => {
            const styles = colorStyles[feature.color as keyof typeof colorStyles];
            return (
              <div
                key={feature.title}
                className={`rounded-2xl border ${styles.border} ${styles.bg} p-6 transition-all hover:shadow-lg`}
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${styles.icon}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>

                <ul className="mt-5 space-y-2.5">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <CheckCircleIcon
                        className={`mt-0.5 h-4 w-4 shrink-0 ${styles.check}`}
                      />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    trackEvent("cta_click", {
                      button_name: `try_${feature.title.toLowerCase().replace(" ", "_")}`,
                      location: "features",
                    });
                    if (feature.title === "AI Detection") {
                      window.location.href = "/ai-detector";
                    } else {
                      onContinueWithGoogle();
                    }
                  }}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm"
                >
                  Try {feature.title}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────

function Faq() {
  const items = [
    {
      q: "What is Drip?",
      a: "Drip is a tool that streams your writing into Google Docs over a schedule you choose. You can also use it to detect AI-generated content and humanize your text.",
    },
    {
      q: "Is it free to use?",
      a: "Yes! Drip is completely free. Sign in with Google to get started. No credit card required.",
    },
    {
      q: "What file formats can I import?",
      a: "You can import .txt, .md, .docx, and .pdf files up to 25 MB. All parsing happens in your browser — files never leave your device.",
    },
    {
      q: "What Google permissions does Drip need?",
      a: "We use the drive.file scope, which means Drip can only access documents it creates. It cannot see or modify any other files in your Drive.",
    },
    {
      q: "How accurate is the AI detection?",
      a: "Our AI detection achieves 99% accuracy with sentence-level highlighting, so you can see exactly which parts of your text might be flagged.",
    },
    {
      q: "Can I disconnect my Google account?",
      a: "Yes, you can log out anytime from within the app, or revoke access at myaccount.google.com/permissions.",
    },
  ];

  return (
    <section id="faq" className="border-t border-gray-100 bg-gray-50/50 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            FAQ
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          {items.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm transition-all open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
                {item.q}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-transform group-open:rotate-45">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────

function CtaBanner({ onContinueWithGoogle }: Props) {
  return (
    <section className="border-t border-gray-100 bg-gradient-to-b from-white to-blue-50 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ready to get started?
        </h2>
        <p className="mt-3 text-lg text-gray-600">
          Join thousands of writers using Drip to manage their content.
          Free forever, no credit card required.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              trackEvent("cta_click", {
                button_name: "start_free_cta",
                location: "cta_banner",
              });
              onContinueWithGoogle();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
          >
            <GoogleGIcon className="h-5 w-5" />
            Start Free with Google
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <LogoIcon className="h-7 w-7" />
          <span className="text-base font-bold tracking-tight text-gray-900">
            Drip
          </span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
          <a href="#features" className="hover:text-gray-900">
            Features
          </a>
          <Link href="/ai-detector" className="hover:text-gray-900">
            AI Detector
          </Link>
          <Link href="/privacy" className="hover:text-gray-900">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-gray-900">
            Terms
          </Link>
          <a href="mailto:abuisaapon962974@gmail.com" className="hover:text-gray-900">
            Contact
          </a>
        </nav>
        <p className="text-sm text-gray-400">© 2026 Apon</p>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ───────────────────────────────────────────────

export default function Landing({ onContinueWithGoogle }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <Nav onContinueWithGoogle={onContinueWithGoogle} />
      <Hero onContinueWithGoogle={onContinueWithGoogle} />
      <InteractiveDemo onContinueWithGoogle={onContinueWithGoogle} />
      <Features onContinueWithGoogle={onContinueWithGoogle} />
      <Faq />
      <CtaBanner onContinueWithGoogle={onContinueWithGoogle} />
      <Footer />
    </div>
  );
}
