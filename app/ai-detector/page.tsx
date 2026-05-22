"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { Droplets } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────

type DetectionResult = {
  aiScore: number;
  humanScore: number;
  explanation: string;
  sentences: Array<{
    text: string;
    aiProbability: number;
  }>;
};

type RewriteResult = {
  rewrittenText: string;
};

// ─── Placeholder API functions ────────────────────────────────────────

async function detectAI(text: string): Promise<DetectionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const avgWordLength =
    text.replace(/\s+/g, "").length / Math.max(wordCount, 1);

  let baseAiScore = 45;
  if (avgWordLength > 5) baseAiScore += 15;
  if (text.includes(",") && text.includes(".")) baseAiScore += 10;
  if (wordCount > 100) baseAiScore += 10;
  if (text.toLowerCase().includes("therefore")) baseAiScore += 5;
  if (text.toLowerCase().includes("however")) baseAiScore += 5;
  if (text.toLowerCase().includes("furthermore")) baseAiScore += 5;
  baseAiScore = Math.min(Math.max(baseAiScore, 0), 100);

  const analyzedSentences = sentences.map((s) => {
    const variation = Math.random() * 30 - 15;
    return {
      text: s.trim(),
      aiProbability: Math.min(Math.max(baseAiScore + variation, 0), 100),
    };
  });

  let explanation: string;
  if (baseAiScore >= 70) {
    explanation =
      "Your text is likely to be written entirely by AI. We detected consistent patterns typical of AI-generated content.";
  } else if (baseAiScore >= 40) {
    explanation =
      "Your text may include parts written by AI. Some sections show AI-like patterns while others appear human-written.";
  } else {
    explanation =
      "Your text is likely to be written entirely by a human. Natural variations and personal voice detected throughout.";
  }

  return {
    aiScore: baseAiScore,
    humanScore: 100 - baseAiScore,
    explanation,
    sentences: analyzedSentences,
  };
}

async function rewriteText(text: string): Promise<RewriteResult> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const sentences = text.split(/(?<=[.!?])\s+/);
  const rewritten = sentences
    .map((sentence, i) => {
      if (i === 0) return sentence;
      if (sentence.toLowerCase().startsWith("the ")) {
        return sentence.replace(/^the /i, "This ");
      }
      return sentence;
    })
    .join(" ");

  return {
    rewrittenText:
      rewritten +
      "\n\n[Placeholder output - connect a real API for actual humanization]",
  };
}

// ─── Components ───────────────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
        <Droplets className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-semibold text-white tracking-tight">Drip</span>
    </Link>
  );
}

function StatCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: "blue" | "green" | "purple";
}) {
  const colors = {
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-emerald-500/20 text-emerald-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div
      className={`rounded-xl px-4 py-3 text-center ${colors[color]}`}
    >
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-800/50 p-5 transition-all hover:border-emerald-500/30 hover:bg-gray-800">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
    </div>
  );
}

function SentenceHighlight({
  sentence,
  probability,
}: {
  sentence: string;
  probability: number;
}) {
  const getBgColor = (prob: number) => {
    if (prob >= 70) return "bg-red-500/10 border-red-500/30";
    if (prob >= 40) return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-emerald-500/10 border-emerald-500/30";
  };

  const getLabel = (prob: number) => {
    if (prob >= 70) return { text: "AI", color: "text-red-400 bg-red-500/20" };
    if (prob >= 40)
      return { text: "Mixed", color: "text-yellow-400 bg-yellow-500/20" };
    return { text: "Human", color: "text-emerald-400 bg-emerald-500/20" };
  };

  const label = getLabel(probability);

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-3 ${getBgColor(probability)}`}
    >
      <span
        className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${label.color}`}
      >
        {label.text}
      </span>
      <p className="text-sm text-gray-300">{sentence}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────

export default function AIDetectorPage() {
  const [inputText, setInputText] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [detectionResult, setDetectionResult] =
    useState<DetectionResult | null>(null);
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"detect" | "rewrite">("detect");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARS = 10000;

  useEffect(() => {
    trackEvent("ai_detector_page_view");
  }, []);

  const charCount = inputText.length;
  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;

  function handleClear() {
    setInputText("");
    setDetectionResult(null);
    setRewriteResult(null);
    setError(null);
    textareaRef.current?.focus();
  }

  async function handleDetect() {
    if (!inputText.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }
    if (inputText.length > MAX_CHARS) {
      setError(`Text exceeds ${MAX_CHARS.toLocaleString()} character limit.`);
      return;
    }

    setError(null);
    setIsDetecting(true);
    setDetectionResult(null);

    trackEvent("ai_detect_clicked", { word_count: wordCount, char_count: charCount });

    try {
      const result = await detectAI(inputText);
      setDetectionResult(result);
    } catch {
      setError("Detection failed. Please try again.");
    } finally {
      setIsDetecting(false);
    }
  }

  async function handleRewrite() {
    if (!inputText.trim()) {
      setError("Please enter some text to humanize.");
      return;
    }

    setError(null);
    setIsRewriting(true);
    setRewriteResult(null);

    trackEvent("rewrite_clicked", { word_count: wordCount, char_count: charCount });

    try {
      const result = await rewriteText(inputText);
      setRewriteResult(result);
    } catch {
      setError("Humanization failed. Please try again.");
    } finally {
      setIsRewriting(false);
    }
  }

  async function handleCopy() {
    if (!rewriteResult?.rewrittenText) return;
    try {
      await navigator.clipboard.writeText(rewriteResult.rewrittenText);
      setCopied(true);
      trackEvent("rewritten_text_copied", {
        text_length: rewriteResult.rewrittenText.length,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy text.");
    }
  }

  const isLoading = isDetecting || isRewriting;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/#features" className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/ai-detector" className="relative px-4 py-2 text-sm font-medium text-white transition-colors">
              AI Detector
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              href="/"
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-500 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-16 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
            AI Detection
          </span>
          <h1 className="mt-6 text-3xl font-serif font-medium text-white sm:text-4xl lg:text-5xl">
            The most accurate AI detector
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 lg:text-lg">
            Detect AI-generated text with sentence-level highlighting. Trusted
            by educators, publishers, and content creators worldwide.
          </p>

          {/* Stats */}
          <div className="mx-auto mt-8 flex max-w-md justify-center gap-4">
            <StatCard value="99%" label="Accuracy" color="blue" />
            <StatCard value="10M+" label="Scans" color="green" />
            <StatCard value="Free" label="To Use" color="purple" />
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-4xl px-6">
          {/* Tab Selector */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-xl bg-gray-800 p-1">
              <button
                onClick={() => setActiveTab("detect")}
                className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "detect"
                    ? "bg-gray-700 text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                AI Detection
              </button>
              <button
                onClick={() => setActiveTab("rewrite")}
                className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "rewrite"
                    ? "bg-gray-700 text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Humanize Text
              </button>
            </div>
          </div>

          {/* Input Card */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            {/* Textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setError(null);
                }}
                placeholder={
                  activeTab === "detect"
                    ? "Paste your text here to check for AI-generated content..."
                    : "Paste AI-generated text here to humanize it..."
                }
                rows={10}
                disabled={isLoading}
                className="block w-full resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-4 text-sm text-white transition-all placeholder:text-gray-500 focus:border-emerald-500 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {/* Character counter */}
              <div className="absolute bottom-3 right-3 rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-400">
                {charCount.toLocaleString()}/{MAX_CHARS.toLocaleString()}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{wordCount} words</span>
                <span className="text-gray-600">|</span>
                <button
                  onClick={handleClear}
                  disabled={isLoading || !inputText}
                  className="text-gray-500 transition-colors hover:text-gray-300 disabled:opacity-50"
                >
                  Clear
                </button>
              </div>

              <button
                onClick={activeTab === "detect" ? handleDetect : handleRewrite}
                disabled={isLoading || !inputText.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
              >
                {isLoading && (
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
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
                )}
                {activeTab === "detect"
                  ? isDetecting
                    ? "Scanning..."
                    : "Scan for AI"
                  : isRewriting
                    ? "Humanizing..."
                    : "Humanize"}
              </button>
            </div>

            {/* Privacy note */}
            <p className="mt-4 text-center text-xs text-gray-500">
              Your text is processed securely and never stored.
            </p>
          </div>

          {/* Detection Results */}
          {detectionResult && activeTab === "detect" && (
            <div className="mt-8 animate-fade-in-up space-y-6">
              {/* Score Card */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <h2 className="text-lg font-semibold text-white">
                  Detection Results
                </h2>

                {/* Score Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-emerald-400">Human</span>
                    <span className="text-red-400">AI</span>
                  </div>
                  <div className="mt-2 h-4 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500 transition-all duration-1000"
                      style={{ width: "100%" }}
                    />
                    <div
                      className="relative -mt-4 h-4"
                      style={{ marginLeft: `${detectionResult.aiScore}%` }}
                    >
                      <div className="absolute -ml-2 h-6 w-1 -translate-y-1 rounded-full bg-white shadow-lg" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span
                      className={`text-3xl font-bold ${
                        detectionResult.aiScore >= 50
                          ? "text-red-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {detectionResult.aiScore}%
                    </span>
                    <span className="text-gray-400">
                      probability AI-generated
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-6 rounded-xl bg-gray-800 p-4">
                  <p className="text-sm text-gray-300">
                    {detectionResult.explanation}
                  </p>
                </div>
              </div>

              {/* Sentence Analysis */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <h2 className="text-lg font-semibold text-white">
                  Sentence-Level Analysis
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Each sentence is highlighted based on AI probability
                </p>

                <div className="mt-4 space-y-2">
                  {detectionResult.sentences.map((s, i) => (
                    <SentenceHighlight
                      key={i}
                      sentence={s.text}
                      probability={s.aiProbability}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-gray-800 pt-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-3 w-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
                    <span className="text-gray-400">Likely Human</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-3 w-3 rounded bg-yellow-500/30 border border-yellow-500/50" />
                    <span className="text-gray-400">Mixed/Uncertain</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-3 w-3 rounded bg-red-500/30 border border-red-500/50" />
                    <span className="text-gray-400">Likely AI</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rewrite Results */}
          {rewriteResult && activeTab === "rewrite" && (
            <div className="mt-8 animate-fade-in-up">
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    Humanized Text
                  </h2>
                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      copied
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 rounded-xl border border-gray-700 bg-gray-800 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
                    {rewriteResult.rewrittenText}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      {!detectionResult && !rewriteResult && (
        <section className="border-t border-gray-800 bg-gray-900 py-14">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-2xl font-bold text-white">
              Why use our AI Detector?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-gray-400">
              Industry-leading accuracy with detailed analysis to help you
              understand AI-generated content.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                }
                title="99% Accuracy"
                description="Our model is trained on millions of samples to deliver best-in-class detection accuracy."
              />
              <FeatureCard
                icon={
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                  </svg>
                }
                title="Sentence Highlighting"
                description="See exactly which sentences are likely AI-generated with color-coded highlighting."
              />
              <FeatureCard
                icon={
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
                title="Privacy First"
                description="Your text is never stored or used for training. Analysis happens securely in real-time."
              />
              <FeatureCard
                icon={
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                    <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
                  </svg>
                }
                title="AI Humanizer"
                description="Transform AI-generated text to sound more natural and bypass detection."
              />
              <FeatureCard
                icon={
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                }
                title="Instant Results"
                description="Get comprehensive analysis in seconds, not minutes. No waiting required."
              />
              <FeatureCard
                icon={
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                }
                title="100% Free"
                description="No subscription required. Use our AI detector and humanizer completely free."
              />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Drip</span>
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/ai-detector" className="hover:text-white transition-colors">AI Detector</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </nav>
          <p className="text-sm text-gray-500">&copy; 2026 Drip</p>
        </div>
      </footer>
    </div>
  );
}
