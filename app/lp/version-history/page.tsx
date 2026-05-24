"use client";

import { useAuth } from "@/lib/auth-context";
import { LandingPageFAQJsonLd, HowToJsonLd } from "@/lib/structured-data";
import { LPHeader } from "../components/lp-header";
import { LPHero } from "../components/lp-hero";
import { LPFeatures } from "../components/lp-features";
import { LPCtaSection } from "../components/lp-cta-section";
import { LPFAQ } from "../components/lp-faq";
import { LPFooter } from "../components/lp-footer";

const PAGE_LOCATION = "lp-version-history";

const faqs = [
  {
    question: "What is Google Docs version history?",
    answer:
      "Google Docs version history is a built-in feature that tracks every change made to a document. It shows when edits were made and allows you to restore previous versions. Our tool helps you create authentic version history by scheduling text to appear gradually over time.",
  },
  {
    question: "How does version history scheduling work?",
    answer:
      "You paste or upload your text, choose a duration (from 30 minutes to 1 week), and our tool gradually inserts the content into a new Google Doc sentence by sentence. This creates a realistic revision history showing your document being written over time.",
  },
  {
    question: "Will Google detect that I used this tool?",
    answer:
      "Our tool uses Google's official APIs to add text to your document. The version history created is indistinguishable from natural writing because the text is actually being added over time, just like regular typing.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes! Docs Version History is completely free. No credit card required, no hidden fees. Just sign in with your Google account and start creating realistic version history for your documents.",
  },
];

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Scheduled Delivery",
    description:
      "Choose how long to build your version history - from 30 minutes to an entire week.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    ),
    title: "Multiple Formats",
    description:
      "Import from .txt, .docx, .pdf, or paste text directly. We preserve your formatting.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
    title: "Authentic History",
    description:
      "Creates real Google Docs revision history that shows your writing progress over time.",
  },
];

const howToSteps = [
  {
    name: "Import your document",
    text: "Paste your text or upload a file (.txt, .docx, or .pdf). We'll preserve your formatting automatically.",
  },
  {
    name: "Set your schedule",
    text: "Choose how long you want the version history to span - from 30 minutes to 1 week.",
  },
  {
    name: "Watch it build",
    text: "Your text is added to a new Google Doc sentence by sentence, creating authentic revision history.",
  },
];

export default function VersionHistoryLandingPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950">
      <LandingPageFAQJsonLd faqs={faqs} />
      <HowToJsonLd
        name="How to Create Google Docs Version History"
        description="Step-by-step guide to creating realistic version history in Google Docs using our free tool."
        steps={howToSteps}
      />

      <LPHeader
        ctaText="Create Version History"
        onCtaClick={signInWithGoogle}
        ctaId="lp-vh-header-cta"
        location={PAGE_LOCATION}
      />

      <main id="main-content">
        <LPHero
          badge="Free Version History Tool"
          headline={
            <>
              Add Realistic Version History to
              <br />
              <span className="text-emerald-400">Your Google Docs</span>
            </>
          }
          subheadline="Create authentic document revision history by scheduling text to appear gradually. Perfect for tracking writing progress and demonstrating your work process."
          ctaText="Create Version History Free"
          onCtaClick={signInWithGoogle}
          ctaId="lp-vh-hero-cta"
          location={PAGE_LOCATION}
          trustBadges={[
            "100% Free",
            "No credit card",
            "Creates real history",
          ]}
        />

        <LPFeatures
          heading="Everything You Need for Document History"
          subheading="Build authentic Google Docs revision history with our powerful scheduling tool."
          features={features}
        />

        <LPFAQ faqs={faqs} />

        <LPCtaSection
          heading="Start Building Version History Today"
          subheading="Join thousands of users creating realistic Google Docs revision history. Get started in seconds."
          ctaText="Create Version History Free"
          onCtaClick={signInWithGoogle}
          ctaId="lp-vh-bottom-cta"
          location={PAGE_LOCATION}
        />
      </main>

      <LPFooter />
    </div>
  );
}
