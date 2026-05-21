"use client";

import { useAuth } from "@/lib/auth-context";
import {
  Logo,
  Footer,
  GoogleIcon,
  CheckIcon,
} from "@/lib/shared-components";
import Link from "next/link";

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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo dark />
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-gray-800 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              About
            </Link>
            <Link
              href="/ai-detector"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              AI Detector
            </Link>
          </nav>
          <button
            onClick={() => signInWithGoogle()}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-500"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            100% Free
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Drip is completely free to use. No hidden fees, no credit card
            required. Just sign in with Google and start dripping.
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
                className={`relative rounded-2xl border-2 p-8 transition-all ${
                  plan.popular
                    ? "border-emerald-500 bg-emerald-500/5"
                    : "border-gray-800 bg-gray-800/50"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    {plan.description}
                  </p>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => !plan.disabled && signInWithGoogle()}
                  disabled={plan.disabled}
                  className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500"
                      : plan.disabled
                        ? "cursor-not-allowed bg-gray-800 text-gray-500"
                        : "border border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {plan.popular && (
                    <GoogleIcon className="mr-2 inline h-4 w-4" />
                  )}
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-800 bg-gray-950 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-2xl font-bold text-white">
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
                className="group rounded-xl border border-gray-800 bg-gray-900 px-6 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-white">
                  {item.q}
                  <span className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-transform group-open:rotate-45">
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
                <p className="mt-3 text-gray-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer dark />
    </div>
  );
}
