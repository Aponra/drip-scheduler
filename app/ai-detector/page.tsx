"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

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
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-white"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        </svg>
      </div>
      <span className="text-lg font-semibold text-gray-900">AI Detector</span>
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
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    purple: "bg-purple-50 text-purple-700",
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
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-100 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
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
    if (prob >= 70) return "bg-red-100 border-red-200";
    if (prob >= 40) return "bg-yellow-50 border-yellow-200";
    return "bg-emerald-50 border-emerald-200";
  };

  const getLabel = (prob: number) => {
    if (prob >= 70) return { text: "AI", color: "text-red-600 bg-red-50" };
    if (prob >= 40)
      return { text: "Mixed", color: "text-yellow-700 bg-yellow-50" };
    return { text: "Human", color: "text-emerald-600 bg-emerald-50" };
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
      <p className="text-sm text-gray-700">{sentence}</p>
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-white to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/80 to-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            The most accurate AI detector
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 lg:text-lg">
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
            <div className="inline-flex rounded-xl bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab("detect")}
                className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "detect"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                AI Detection
              </button>
              <button
                onClick={() => setActiveTab("rewrite")}
                className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "rewrite"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Humanize Text
              </button>
            </div>
          </div>

          {/* Input Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-100/50">
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
                className="block w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {/* Character counter */}
              <div className="absolute bottom-3 right-3 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-400 shadow-sm">
                {charCount.toLocaleString()}/{MAX_CHARS.toLocaleString()}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{wordCount} words</span>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleClear}
                  disabled={isLoading || !inputText}
                  className="text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-50"
                >
                  Clear
                </button>
              </div>

              <button
                onClick={activeTab === "detect" ? handleDetect : handleRewrite}
                disabled={isLoading || !inputText.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
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
            <p className="mt-4 text-center text-xs text-gray-400">
              Your text is processed securely and never stored.
            </p>
          </div>

          {/* Detection Results */}
          {detectionResult && activeTab === "detect" && (
            <div className="mt-8 animate-fade-in-up space-y-6">
              {/* Score Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-100/50">
                <h2 className="text-lg font-semibold text-gray-900">
                  Detection Results
                </h2>

                {/* Score Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-emerald-600">Human</span>
                    <span className="text-red-600">AI</span>
                  </div>
                  <div className="mt-2 h-4 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500 transition-all duration-1000"
                      style={{ width: "100%" }}
                    />
                    <div
                      className="relative -mt-4 h-4"
                      style={{ marginLeft: `${detectionResult.aiScore}%` }}
                    >
                      <div className="absolute -ml-2 h-6 w-1 -translate-y-1 rounded-full bg-gray-800 shadow-lg" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span
                      className={`text-3xl font-bold ${
                        detectionResult.aiScore >= 50
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {detectionResult.aiScore}%
                    </span>
                    <span className="text-gray-500">
                      probability AI-generated
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-6 rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-700">
                    {detectionResult.explanation}
                  </p>
                </div>
              </div>

              {/* Sentence Analysis */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-100/50">
                <h2 className="text-lg font-semibold text-gray-900">
                  Sentence-Level Analysis
                </h2>
                <p className="mt-1 text-sm text-gray-500">
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
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-3 w-3 rounded bg-emerald-100 border border-emerald-200" />
                    <span className="text-gray-600">Likely Human</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-3 w-3 rounded bg-yellow-50 border border-yellow-200" />
                    <span className="text-gray-600">Mixed/Uncertain</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-3 w-3 rounded bg-red-100 border border-red-200" />
                    <span className="text-gray-600">Likely AI</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rewrite Results */}
          {rewriteResult && activeTab === "rewrite" && (
            <div className="mt-8 animate-fade-in-up">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-100/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Humanized Text
                  </h2>
                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      copied
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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

                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
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
        <section className="border-t border-gray-100 bg-gray-50/50 py-14">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Why use our AI Detector?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-gray-600">
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
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <Logo />
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gray-900">
              Terms
            </Link>
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
