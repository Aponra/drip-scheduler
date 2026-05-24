"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Droplets, Check } from "lucide-react";
import { trackCtaClick } from "@/lib/analytics";

// ─── Navigation ──────────────────────────────────────────────────────

function Nav({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">
            Docs Version History
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/#features" className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="relative px-4 py-2 text-sm font-medium text-white transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/ai-detector" className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            AI Detector
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              trackCtaClick({ cta_id: "pricing-navbar-login", cta_text: "Log in", location: "pricing-navbar" });
              onGetStarted();
            }}
            className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => {
              trackCtaClick({ cta_id: "pricing-navbar-get-started", cta_text: "Get Started", location: "pricing-navbar" });
              onGetStarted();
            }}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-500 transition-all"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">Docs Version History</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/ai-detector" className="hover:text-white transition-colors">AI Detector</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
        </nav>
        <p className="text-sm text-gray-500">&copy; 2026 Docs Version History</p>
      </div>
    </footer>
  );
}

// ─── Google Icon ─────────────────────────────────────────────────────

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.06-1.36-.18-2H12v3.79h5.39a4.6 4.6 0 0 1-2 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.32z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.23-2.51c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.59-4.13H3.07v2.6A10 10 0 0 0 12 22z" />
      <path fill="#FBBC05" d="M6.41 13.89A6 6 0 0 1 6.09 12c0-.66.11-1.3.32-1.89V7.51H3.07a10 10 0 0 0 0 8.98l3.34-2.6z" />
      <path fill="#EA4335" d="M12 5.98c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 3.04 14.7 2.16 12 2.16A10 10 0 0 0 3.07 7.51l3.34 2.6C7.2 7.74 9.4 5.98 12 5.98z" />
    </svg>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function PricingPage() {
  const { signInWithGoogle } = useAuth();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Everything you need to get started",
      features: [
        "Unlimited schedules",
        "AI text detection",
        "Text humanization",
        "Import .txt, .md, .docx, .pdf",
        "Export to Google Docs",
        "Save & resume schedules",
        "Sentence-level highlighting",
      ],
      cta: "Get Started Free",
      popular: true,
    },
    {
      name: "Pro",
      price: "$0",
      period: "forever",
      description: "Advanced features coming soon",
      features: [
        "Everything in Free",
        "Priority support",
        "Early access to new features",
        "Higher rate limits",
        "API access (coming soon)",
        "Team collaboration (coming soon)",
        "Custom integrations (coming soon)",
      ],
      cta: "Coming Soon",
      popular: false,
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <Nav onGetStarted={signInWithGoogle} />

      {/* Hero */}
      <section className="py-16 lg:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
            100% Free
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-serif font-medium text-white">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Docs Version History is completely free to use. No hidden fees, no credit card
            required. Just sign in with Google and start creating version history.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.popular
                    ? "bg-gray-900 border-emerald-500"
                    : "bg-gray-900 border-gray-800"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">{plan.description}</p>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (!plan.disabled) {
                      trackCtaClick({
                        cta_id: `pricing-${plan.name.toLowerCase()}-cta`,
                        cta_text: plan.cta,
                        location: "pricing-card",
                      });
                      signInWithGoogle();
                    }
                  }}
                  disabled={plan.disabled}
                  className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-emerald-600 text-white hover:bg-emerald-500"
                      : plan.disabled
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {plan.popular && <GoogleIcon className="mr-2 inline h-4 w-4" />}
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-800 bg-gray-900 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-white">
            Frequently asked questions
          </h2>

          <div className="mt-10 space-y-4">
            {[
              {
                q: "Is Docs Version History really free?",
                a: "Yes! Docs Version History is 100% free to use. We believe everyone should have access to great writing tools without paying.",
              },
              {
                q: "Will there be paid plans in the future?",
                a: "We may introduce premium features in the future, but the core functionality will always remain free.",
              },
              {
                q: "Are there any usage limits?",
                a: "Currently, there are no strict limits. We ask that you use the service responsibly.",
              },
              {
                q: "Do I need a credit card to sign up?",
                a: "No credit card required. Just sign in with your Google account and you're ready to go.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-gray-800 bg-gray-900 px-6 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-white">
                  {item.q}
                  <span className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-transform group-open:rotate-45">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-gray-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
