import type { Metadata } from "next";
import { AIDetectorFAQJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "AI Detector - Free AI Content Detection Tool",
  description:
    "Detect AI-generated text with 99% accuracy. Free AI content detector with sentence-level highlighting. Check if text was written by ChatGPT, Claude, or other AI tools.",
  keywords: [
    "AI detector",
    "AI content detector",
    "ChatGPT detector",
    "AI writing detector",
    "detect AI text",
    "AI plagiarism checker",
    "humanize AI text",
  ],
  openGraph: {
    title: "Free AI Detector - Detect AI-Generated Content",
    description:
      "Detect AI-generated text with 99% accuracy. Free tool with sentence-level highlighting to identify ChatGPT and AI-written content.",
    url: "https://docsversionhistory.com/ai-detector",
  },
  twitter: {
    title: "Free AI Detector - 99% Accuracy",
    description:
      "Detect AI-generated text instantly. Free AI content detector with sentence-level analysis.",
  },
  alternates: {
    canonical: "https://docsversionhistory.com/ai-detector",
  },
};

export default function AIDetectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AIDetectorFAQJsonLd />
    </>
  );
}
