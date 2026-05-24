"use client";

import { useState } from "react";
import Link from "next/link";
import { trackCtaClick, trackEvent } from "@/lib/analytics";
import { LandingPageFAQJsonLd } from "@/lib/structured-data";
import { LPHeader } from "../components/lp-header";
import { LPHero } from "../components/lp-hero";
import { LPFeatures } from "../components/lp-features";
import { LPCtaSection } from "../components/lp-cta-section";
import { LPFAQ } from "../components/lp-faq";
import { LPFooter } from "../components/lp-footer";

const PAGE_LOCATION = "lp-ai-detector";

const faqs = [
  {
    question: "How accurate is your AI detector?",
    answer:
      "Our AI detector achieves 99% accuracy in identifying AI-generated content. We use advanced machine learning models trained on millions of samples to distinguish between human and AI-written text.",
  },
  {
    question: "Which AI models can you detect?",
    answer:
      "We can detect content from ChatGPT (GPT-3.5, GPT-4), Claude, Bard, Jasper, Copy.ai, and other major AI writing tools. Our models are continuously updated to detect the latest AI systems.",
  },
  {
    question: "Is my text stored or shared?",
    answer:
      "Never. Your text is processed in real-time and immediately discarded after analysis. We don't store, share, or use your content for training. Your privacy is our priority.",
  },
  {
    question: "Can I humanize AI-generated text?",
    answer:
      "Yes! Our built-in humanizer transforms AI-generated content to sound more natural while preserving the original meaning. It adjusts sentence structure, word choice, and flow patterns.",
  },
];

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    title: "99% Accuracy",
    description:
      "Industry-leading detection accuracy trained on millions of samples from all major AI tools.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    ),
    title: "Sentence Highlighting",
    description:
      "See exactly which sentences are likely AI-generated with color-coded highlighting.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
      </svg>
    ),
    title: "Text Humanization",
    description:
      "Transform AI content to sound natural and bypass detection tools instantly.",
  },
];

function InlineDemo() {
  const [text, setText] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (!text.trim()) return;

    trackCtaClick({
      cta_id: "lp-ai-demo-scan",
      cta_text: "Scan for AI",
      location: PAGE_LOCATION,
    });
    trackEvent("lp_ai_demo_scan", { char_count: text.length });

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Redirect to full tool
      window.location.href = "/ai-detector";
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl border border-gray-800 p-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here to check for AI-generated content..."
        rows={4}
        className="w-full bg-gray-800 text-white placeholder:text-gray-500 rounded-xl border border-gray-700 px-4 py-3 resize-none focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      />
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {text.length.toLocaleString()} characters
        </span>
        <button
          onClick={handleScan}
          disabled={!text.trim() || isScanning}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-target"
        >
          {isScanning ? "Scanning..." : "Scan for AI"}
        </button>
      </div>
    </div>
  );
}

export default function AIDetectorLandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <LandingPageFAQJsonLd faqs={faqs} />

      <LPHeader
        ctaText="Try AI Detector"
        ctaHref="/ai-detector"
        ctaId="lp-ai-header-cta"
        location={PAGE_LOCATION}
      />

      <main id="main-content">
        <LPHero
          badge="Free AI Detection"
          headline={
            <>
              Detect AI-Generated Content
              <br />
              <span className="text-emerald-400">With 99% Accuracy</span>
            </>
          }
          subheadline="The most accurate AI content detector. Identify ChatGPT, Claude, and other AI-written text with sentence-level highlighting. Free to use, no account required."
          ctaText="Scan Your Text Free"
          ctaHref="/ai-detector"
          ctaId="lp-ai-hero-cta"
          location={PAGE_LOCATION}
          trustBadges={["99% Accuracy", "Privacy First", "100% Free"]}
          demo={<InlineDemo />}
        />

        <LPFeatures
          heading="Why Use Our AI Detector?"
          subheading="Industry-leading accuracy with detailed analysis to help you understand AI-generated content."
          features={features}
        />

        <LPFAQ faqs={faqs} />

        <LPCtaSection
          heading="Ready to Detect AI Content?"
          subheading="Join millions of users trusting our AI detector. Free forever, no credit card required."
          ctaText="Scan Your Text Free"
          ctaHref="/ai-detector"
          ctaId="lp-ai-bottom-cta"
          location={PAGE_LOCATION}
        />
      </main>

      <LPFooter />
    </div>
  );
}
