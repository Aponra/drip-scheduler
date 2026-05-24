"use client";

import { useAuth } from "@/lib/auth-context";
import { LandingPageFAQJsonLd } from "@/lib/structured-data";
import { LPHeader } from "../components/lp-header";
import { LPHero } from "../components/lp-hero";
import { LPFeatures } from "../components/lp-features";
import { LPCtaSection } from "../components/lp-cta-section";
import { LPFAQ } from "../components/lp-faq";
import { LPFooter } from "../components/lp-footer";

const PAGE_LOCATION = "lp-students";

const faqs = [
  {
    question: "How does this help with my academic writing?",
    answer:
      "Our tool helps you document your writing process by creating authentic version history in Google Docs. This shows your progression from draft to final version, demonstrating your original work and revision process.",
  },
  {
    question: "Can I use this for essays and research papers?",
    answer:
      "Absolutely! Our tool is perfect for essays, research papers, thesis work, and any academic writing. It helps you track your progress and create documentation of your writing journey.",
  },
  {
    question: "Is the AI detector useful for students?",
    answer:
      "Yes! Our AI detector helps you check your own work before submission to ensure it reads naturally. The humanization feature can help refine AI-assisted research into your own voice.",
  },
  {
    question: "Is it free for students?",
    answer:
      "Yes! Docs Version History is completely free for everyone, including students. No credit card required, no hidden fees. Just sign in with your Google account to get started.",
  },
];

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    title: "Track Essay Progress",
    description:
      "Document your writing journey from first draft to final submission with authentic version history.",
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
    title: "Research Paper Support",
    description:
      "Perfect for thesis work, term papers, and dissertations. Show your writing process clearly.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    title: "AI Detection Built-In",
    description:
      "Check your work before submission to ensure it reads naturally and authentically.",
  },
];

function UseCaseSection() {
  const useCases = [
    {
      title: "Essays & Reports",
      description: "Create version history showing your essay development from outline to final draft.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      ),
    },
    {
      title: "Research Papers",
      description: "Document your research process with authentic revision tracking over time.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      ),
    },
    {
      title: "Thesis & Dissertations",
      description: "Track long-form academic writing with comprehensive version history.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      title: "Group Projects",
      description: "Demonstrate individual contributions to collaborative assignments.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 px-6 bg-gray-900" aria-labelledby="use-cases-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            id="use-cases-heading"
            className="text-3xl md:text-4xl font-bold text-white"
          >
            Perfect for All Academic Writing
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Track your progress on any type of academic assignment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-emerald-500/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                {useCase.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {useCase.title}
              </h3>
              <p className="text-sm text-gray-400">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function StudentsLandingPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950">
      <LandingPageFAQJsonLd faqs={faqs} />

      <LPHeader
        ctaText="Start Free"
        onCtaClick={signInWithGoogle}
        ctaId="lp-students-header-cta"
        location={PAGE_LOCATION}
      />

      <main id="main-content">
        <LPHero
          badge="Free for Students"
          headline={
            <>
              Track Your Writing Progress
              <br />
              <span className="text-emerald-400">for Academic Success</span>
            </>
          }
          subheadline="Document your writing journey from first draft to final submission. Create authentic version history that shows your progress on essays, research papers, and assignments."
          ctaText="Start Free as a Student"
          onCtaClick={signInWithGoogle}
          ctaId="lp-students-hero-cta"
          location={PAGE_LOCATION}
          trustBadges={["100% Free", "No credit card", "Works with Google Docs"]}
        />

        <LPFeatures
          heading="Built for Academic Success"
          subheading="Tools designed specifically for students and academic writing."
          features={features}
        />

        <UseCaseSection />

        <LPFAQ faqs={faqs} />

        <LPCtaSection
          heading="Start Tracking Your Writing Progress"
          subheading="Join thousands of students using Docs Version History. Free forever, works with your Google account."
          ctaText="Start Free as a Student"
          onCtaClick={signInWithGoogle}
          ctaId="lp-students-bottom-cta"
          location={PAGE_LOCATION}
        />
      </main>

      <LPFooter />
    </div>
  );
}
