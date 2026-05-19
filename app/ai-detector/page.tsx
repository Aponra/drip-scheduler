"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

// ─── Types ────────────────────────────────────────────────────────────

type DetectionResult = {
  aiScore: number; // 0-100
  humanScore: number; // 0-100
  explanation: string;
  confidence: "low" | "medium" | "high";
};

type RewriteResult = {
  rewrittenText: string;
};

// ─── Icons ────────────────────────────────────────────────────────────

function SparklesIcon({ className }: { className?: string }) {
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
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
      <path d="M19 13l1 2 1-2 2-1-2-1-1-2-1 2-2 1 2 1z" />
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
      aria-hidden="true"
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

function CopyIcon({ className }: { className?: string }) {
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
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
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
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function RobotIcon({ className }: { className?: string }) {
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
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <path d="M8 16h0" />
      <path d="M16 16h0" />
      <path d="M9 20v1" />
      <path d="M15 20v1" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
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
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 animate-spin" />
      <div className="absolute inset-[3px] rounded-full bg-white" />
    </div>
  );
}

// ─── Placeholder API functions ────────────────────────────────────────

async function detectAI(text: string): Promise<DetectionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasComplexSentences = text.includes(",") && text.includes(".");
  const avgWordLength =
    text.replace(/\s+/g, "").length / Math.max(wordCount, 1);

  let aiScore = 50;
  if (avgWordLength > 5) aiScore += 15;
  if (hasComplexSentences) aiScore += 10;
  if (wordCount > 100) aiScore += 10;
  if (text.toLowerCase().includes("therefore")) aiScore += 5;
  if (text.toLowerCase().includes("however")) aiScore += 5;
  if (text.toLowerCase().includes("furthermore")) aiScore += 5;
  aiScore = Math.min(Math.max(aiScore, 0), 100);

  const humanScore = 100 - aiScore;

  let explanation: string;
  let confidence: "low" | "medium" | "high";

  if (aiScore >= 70) {
    explanation =
      "High probability of AI-generated content detected. The text exhibits consistent sentence structure, formal vocabulary, and patterns typical of large language models.";
    confidence = "high";
  } else if (aiScore >= 40) {
    explanation =
      "Mixed signals detected. This text shows characteristics of both human and AI writing. It may be AI-assisted or lightly edited AI content.";
    confidence = "medium";
  } else {
    explanation =
      "This text appears predominantly human-written. Natural variations in style, informal elements, and personal voice are present.";
    confidence = "low";
  }

  return { aiScore, humanScore, explanation, confidence };
}

async function rewriteText(text: string): Promise<RewriteResult> {
  await new Promise((resolve) => setTimeout(resolve, 2200));

  const sentences = text.split(/(?<=[.!?])\s+/);
  const rewritten = sentences
    .map((sentence, i) => {
      if (i === 0) return sentence;
      if (sentence.toLowerCase().startsWith("the ")) {
        return sentence.replace(/^the /i, "This ");
      }
      if (sentence.toLowerCase().startsWith("it ")) {
        return sentence.replace(/^it /i, "This ");
      }
      return sentence;
    })
    .join(" ");

  return {
    rewrittenText:
      rewritten +
      "\n\n[Note: This is placeholder output. Connect a real AI rewriting API for actual results.]",
  };
}

// ─── Animated Score Ring ──────────────────────────────────────────────

function ScoreRing({
  score,
  label,
  icon: Icon,
  colorScheme,
  delay = 0,
}: {
  score: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorScheme: "ai" | "human";
  delay?: number;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1000;
      const steps = 60;
      const increment = score / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setAnimatedScore(score);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [score, delay]);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset =
    circumference - (animatedScore / 100) * circumference;

  const colors =
    colorScheme === "ai"
      ? {
          gradient: "from-red-500 via-orange-500 to-amber-500",
          ring: "stroke-red-500",
          bg: "bg-gradient-to-br from-red-500/10 to-orange-500/10",
          text: "text-red-600",
          glow: "shadow-red-500/25",
        }
      : {
          gradient: "from-emerald-500 via-teal-500 to-cyan-500",
          ring: "stroke-emerald-500",
          bg: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
          text: "text-emerald-600",
          glow: "shadow-emerald-500/25",
        };

  return (
    <div className="flex flex-col items-center">
      <div className={`relative h-36 w-36 ${colors.bg} rounded-full p-2`}>
        {/* Glow effect */}
        <div
          className={`absolute inset-0 rounded-full blur-xl opacity-40 ${colors.bg}`}
        />

        <div className="relative h-full w-full">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            {/* Background ring */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200"
            />
            {/* Animated progress ring */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={colors.ring}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: "stroke-dashoffset 0.1s ease-out",
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Icon className={`h-6 w-6 ${colors.text} mb-1`} />
            <span className={`text-3xl font-bold ${colors.text} tabular-nums`}>
              {animatedScore}%
            </span>
          </div>
        </div>
      </div>
      <span className="mt-3 text-sm font-semibold text-gray-700">{label}</span>
    </div>
  );
}

// ─── Confidence Badge ─────────────────────────────────────────────────

function ConfidenceBadge({
  confidence,
}: {
  confidence: "low" | "medium" | "high";
}) {
  const styles = {
    low: "bg-emerald-100 text-emerald-700 border-emerald-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    high: "bg-red-100 text-red-700 border-red-200",
  };

  const labels = {
    low: "Low AI Probability",
    medium: "Medium AI Probability",
    high: "High AI Probability",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[confidence]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          confidence === "low"
            ? "bg-emerald-500"
            : confidence === "medium"
              ? "bg-amber-500"
              : "bg-red-500"
        }`}
      />
      {labels[confidence]}
    </span>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    trackEvent("ai_detector_page_view");
  }, []);

  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = inputText.length;

  function handleClear() {
    setInputText("");
    setDetectionResult(null);
    setRewriteResult(null);
    setError(null);
    setCopied(false);
    textareaRef.current?.focus();
  }

  async function handleDetect() {
    if (!inputText.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }

    setError(null);
    setIsDetecting(true);
    setDetectionResult(null);

    trackEvent("ai_detect_clicked", {
      word_count: wordCount,
      char_count: charCount,
    });

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
      setError("Please enter some text to rewrite.");
      return;
    }

    setError(null);
    setIsRewriting(true);
    setRewriteResult(null);

    trackEvent("rewrite_clicked", {
      word_count: wordCount,
      char_count: charCount,
    });

    try {
      const result = await rewriteText(inputText);
      setRewriteResult(result);
    } catch {
      setError("Rewriting failed. Please try again.");
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-purple-200/40 via-fuchsia-200/30 to-pink-200/40 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-blue-200/40 via-cyan-200/30 to-teal-200/40 blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-violet-200/20 to-fuchsia-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-12 lg:py-16">
        {/* Back link */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Docs Version History
        </Link>

        {/* Header */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-fuchsia-50 px-4 py-1.5 text-sm font-medium text-purple-700">
            <SparklesIcon className="h-4 w-4" />
            AI-Powered Analysis
          </div>
          <h1 className="mt-4 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            AI Text Detector & Rewriter
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600">
            Analyze your text to detect AI-generated content with advanced
            pattern recognition, or transform it to sound more natural and
            human.
          </p>
        </div>

        {/* Main card */}
        <div className="mt-10 rounded-3xl border border-gray-200/60 bg-white/70 p-6 shadow-xl shadow-gray-200/50 backdrop-blur-xl sm:p-8">
          {/* Input section */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="input-text"
                className="flex items-center gap-2 text-sm font-semibold text-gray-800"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </span>
                Enter Your Text
              </label>
              {inputText && (
                <button
                  onClick={handleClear}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshIcon className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>
            <div className="relative mt-3">
              <textarea
                ref={textareaRef}
                id="input-text"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setError(null);
                }}
                placeholder="Paste or type your text here to analyze..."
                rows={8}
                disabled={isLoading}
                className="block w-full resize-none rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              />
              {/* Character count badge */}
              <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-gray-400">
                <span className="rounded-md bg-gray-100 px-2 py-1 font-medium tabular-nums">
                  {wordCount} words
                </span>
                <span className="rounded-md bg-gray-100 px-2 py-1 font-medium tabular-nums">
                  {charCount} chars
                </span>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 text-red-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleDetect}
              disabled={isLoading}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 bg-[length:200%_100%] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-[100%_0] hover:shadow-xl hover:shadow-purple-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDetecting ? (
                <LoadingSpinner className="h-5 w-5" />
              ) : (
                <ScanIcon className="h-5 w-5" />
              )}
              {isDetecting ? "Analyzing..." : "Detect AI Content"}
            </button>
            <button
              onClick={handleRewrite}
              disabled={isLoading}
              className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRewriting ? (
                <LoadingSpinner className="h-5 w-5" />
              ) : (
                <SparklesIcon className="h-5 w-5" />
              )}
              {isRewriting ? "Rewriting..." : "Humanize Text"}
            </button>
          </div>
        </div>

        {/* Detection results */}
        {detectionResult && (
          <div className="mt-8 animate-fade-in-up rounded-3xl border border-gray-200/60 bg-white/70 p-6 shadow-xl shadow-gray-200/50 backdrop-blur-xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white">
                  <ScanIcon className="h-4 w-4" />
                </span>
                Analysis Results
              </h2>
              <ConfidenceBadge confidence={detectionResult.confidence} />
            </div>

            {/* Score rings */}
            <div className="mt-8 flex flex-wrap justify-center gap-12">
              <ScoreRing
                score={detectionResult.aiScore}
                label="AI-Generated"
                icon={RobotIcon}
                colorScheme="ai"
                delay={100}
              />
              <ScoreRing
                score={detectionResult.humanScore}
                label="Human-Written"
                icon={UserIcon}
                colorScheme="human"
                delay={300}
              />
            </div>

            {/* Analysis explanation */}
            <div className="mt-8 rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-slate-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    className="h-5 w-5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Detailed Analysis
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {detectionResult.explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rewrite results */}
        {rewriteResult && (
          <div className="mt-8 animate-fade-in-up rounded-3xl border border-gray-200/60 bg-white/70 p-6 shadow-xl shadow-gray-200/50 backdrop-blur-xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                  <SparklesIcon className="h-4 w-4" />
                </span>
                Humanized Text
              </h2>
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  copied
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-4 w-4" />
                    Copy Text
                  </>
                )}
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {rewriteResult.rewrittenText}
              </p>
            </div>
          </div>
        )}

        {/* Features section */}
        {!detectionResult && !rewriteResult && (
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: ScanIcon,
                title: "AI Detection",
                description: "Identify AI-generated content with high accuracy",
                gradient: "from-purple-500 to-fuchsia-500",
              },
              {
                icon: SparklesIcon,
                title: "Text Humanization",
                description:
                  "Transform AI text to sound natural and authentic",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: CheckIcon,
                title: "Instant Results",
                description: "Get detailed analysis in seconds, not minutes",
                gradient: "from-emerald-500 to-teal-500",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-200/60 bg-white/50 p-5 backdrop-blur-sm transition-all hover:border-purple-200 hover:bg-white/80 hover:shadow-lg"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
          <Link href="/privacy" className="hover:text-gray-900 hover:underline">
            Privacy Policy
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/terms" className="hover:text-gray-900 hover:underline">
            Terms of Service
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/" className="hover:text-gray-900 hover:underline">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
