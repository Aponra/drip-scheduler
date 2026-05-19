"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

// ─── Types ────────────────────────────────────────────────────────────

type DetectionResult = {
  aiScore: number; // 0-100
  humanScore: number; // 0-100
  explanation: string;
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

function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
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

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`animate-spin ${className ?? ""}`}
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
  );
}

// ─── Placeholder API functions ────────────────────────────────────────
// These simulate API calls. Replace with real API integration later.

async function detectAI(text: string): Promise<DetectionResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Placeholder logic: generate fake scores based on text characteristics
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasComplexSentences = text.includes(",") && text.includes(".");
  const avgWordLength =
    text.replace(/\s+/g, "").length / Math.max(wordCount, 1);

  // Fake AI score calculation (just for demo)
  let aiScore = 50;
  if (avgWordLength > 5) aiScore += 15;
  if (hasComplexSentences) aiScore += 10;
  if (wordCount > 100) aiScore += 10;
  if (text.toLowerCase().includes("therefore")) aiScore += 5;
  if (text.toLowerCase().includes("however")) aiScore += 5;
  aiScore = Math.min(Math.max(aiScore, 0), 100);

  const humanScore = 100 - aiScore;

  let explanation: string;
  if (aiScore >= 70) {
    explanation =
      "This text shows patterns commonly associated with AI-generated content, including consistent sentence structure and formal vocabulary choices.";
  } else if (aiScore >= 40) {
    explanation =
      "This text contains a mix of characteristics. Some patterns suggest AI assistance, while others appear more human-like.";
  } else {
    explanation =
      "This text appears to be primarily human-written, with natural variations in sentence structure and personal voice.";
  }

  return { aiScore, humanScore, explanation };
}

async function rewriteText(text: string): Promise<RewriteResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Placeholder: return slightly modified text
  // In production, this would call a real AI rewriting API
  const sentences = text.split(/(?<=[.!?])\s+/);
  const rewritten = sentences
    .map((sentence, i) => {
      if (i === 0) return sentence;
      // Simple placeholder transformation
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

// ─── Score Display Component ──────────────────────────────────────────

function ScoreCircle({
  score,
  label,
  color,
}: {
  score: number;
  label: string;
  color: "red" | "green" | "blue";
}) {
  const colorClasses = {
    red: {
      ring: "text-red-500",
      bg: "bg-red-50",
      text: "text-red-700",
    },
    green: {
      ring: "text-emerald-500",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
    blue: {
      ring: "text-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
  };

  const colors = colorClasses[color];
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={colors.ring}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: "stroke-dashoffset 0.5s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${colors.text}`}>{score}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────

export default function AIDetectorPage() {
  const [inputText, setInputText] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Track page view on mount
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
    <div className="relative min-h-screen bg-white">
      {/* Background gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] w-full bg-gradient-to-b from-blue-50/60 via-violet-50/30 to-transparent"
      />

      <div className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline"
        >
          &larr; Back to Docs Version History
        </Link>

        {/* Header */}
        <div className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            AI Text Detector & Rewriter
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Analyze your text to detect AI-generated content, or rewrite it to
            sound more natural.
          </p>
        </div>

        {/* Input section */}
        <div className="mt-8">
          <label
            htmlFor="input-text"
            className="block text-sm font-medium text-gray-700"
          >
            Paste your text
          </label>
          <textarea
            ref={textareaRef}
            id="input-text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setError(null);
            }}
            placeholder="Paste or type your text here..."
            rows={8}
            disabled={isLoading}
            className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>
              {wordCount} {wordCount === 1 ? "word" : "words"} &middot;{" "}
              {charCount} {charCount === 1 ? "character" : "characters"}
            </span>
            {inputText && (
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="inline-flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshIcon className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleDetect}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:bg-blue-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
          >
            {isDetecting ? (
              <LoadingSpinner className="h-4 w-4" />
            ) : (
              <SearchIcon className="h-4 w-4" />
            )}
            {isDetecting ? "Detecting..." : "Detect AI"}
          </button>
          <button
            onClick={handleRewrite}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
          >
            {isRewriting ? (
              <LoadingSpinner className="h-4 w-4" />
            ) : (
              <SparklesIcon className="h-4 w-4" />
            )}
            {isRewriting ? "Rewriting..." : "Rewrite Text"}
          </button>
        </div>

        {/* Detection results */}
        {detectionResult && (
          <div className="mt-8 animate-fade-in-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Detection Results
            </h2>

            <div className="mt-6 flex justify-center gap-12">
              <ScoreCircle
                score={detectionResult.aiScore}
                label="AI-Generated"
                color={detectionResult.aiScore >= 50 ? "red" : "green"}
              />
              <ScoreCircle
                score={detectionResult.humanScore}
                label="Human-Written"
                color={detectionResult.humanScore >= 50 ? "green" : "red"}
              />
            </div>

            <div className="mt-6 rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-medium text-gray-700">Analysis</p>
              <p className="mt-1 text-sm text-gray-600">
                {detectionResult.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Rewrite results */}
        {rewriteResult && (
          <div className="mt-8 animate-fade-in-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Rewritten Text
              </h2>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {rewriteResult.rewrittenText}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-xs text-gray-500">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <span className="mx-2">&middot;</span>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <span className="mx-2">&middot;</span>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
