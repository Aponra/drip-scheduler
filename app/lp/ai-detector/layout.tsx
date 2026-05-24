import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Content Detector - Detect ChatGPT & AI-Generated Text Free",
  description:
    "Free AI content detector with 99% accuracy. Detect ChatGPT, Claude, Bard, and other AI-generated text instantly. Sentence-level highlighting and text humanization included.",
  keywords: [
    "AI detector",
    "AI content detector",
    "ChatGPT detector",
    "detect AI text",
    "AI checker",
    "AI writing detector",
    "AI plagiarism checker",
    "humanize AI text",
  ],
  openGraph: {
    title: "AI Content Detector - 99% Accuracy",
    description:
      "Free AI detector to identify ChatGPT, Claude, and AI-generated content. Sentence-level analysis included.",
    url: "https://docsversionhistory.com/lp/ai-detector",
  },
  twitter: {
    title: "Free AI Content Detector - 99% Accuracy",
    description:
      "Detect AI-generated text with sentence-level highlighting. Free to use, no account required.",
  },
  alternates: {
    canonical: "https://docsversionhistory.com/lp/ai-detector",
  },
};

export default function AIDetectorLPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
