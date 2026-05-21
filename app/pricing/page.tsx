"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect width="24" height="24" rx="5" fill="#2563EB" />
      <path
        d="M12 5C9.4 8 7.5 11 7.5 14a4.5 4.5 0 0 0 9 0c0-3-1.9-6-4.5-9z"
        fill="#fff"
      />
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
      className={className}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.06-1.36-.18-2H12v3.79h5.39a4.6 4.6 0 0 1-2 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.32z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.23-2.51c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.59-4.13H3.07v2.6A10 10 0 0 0 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.89A6 6 0 0 1 6.09 12c0-.66.11-1.3.32-1.89V7.51H3.07a10 10 0 0 0 0 8.98l3.34-2.6z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 3.04 14.7 2.16 12 2.16A10 10 0 0 0 3.07 7.51l3.34 2.6C7.2 7.74 9.4 5.98 12 5.98z"
      />
    </svg>
  );
}

export default function PricingPage() {
  const { signInWithGoogle } = useAuth();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Everything you need to get started",
      features: [
        "Unlimited drip schedules",
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoIcon className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Drip
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              About
            </Link>
          </nav>
          <button
            onClick={() => signInWithGoogle()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            100% Free
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Drip is completely free to use. No hidden fees, no credit card required.
            Just sign in with Google and start dripping.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 bg-white p-8 shadow-lg transition-all ${
                  plan.popular
                    ? "border-blue-600 shadow-blue-100"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => !plan.disabled && signInWithGoogle()}
                  disabled={plan.disabled}
                  className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
                      : plan.disabled
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {plan.popular && <GoogleGIcon className="mr-2 inline h-4 w-4" />}
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Frequently asked questions
          </h2>

          <div className="mt-10 space-y-4">
            {[
              {
                q: "Is Drip really free?",
                a: "Yes! Drip is 100% free to use. We believe everyone should have access to great writing tools without paying.",
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
                className="group rounded-xl border border-gray-200 bg-white px-6 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-900">
                  {item.q}
                  <span className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-transform group-open:rotate-45">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <LogoIcon className="h-7 w-7" />
            <span className="text-base font-bold tracking-tight text-gray-900">
              Drip
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <Link href="/pricing" className="hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/about" className="hover:text-gray-900">
              About
            </Link>
            <Link href="/privacy" className="hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gray-900">
              Terms
            </Link>
          </nav>
          <p className="text-sm text-gray-400">&copy; 2026 Apon</p>
        </div>
      </footer>
    </div>
  );
}
