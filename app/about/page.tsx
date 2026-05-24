"use client";

import Link from "next/link";
import { Droplets, ScanSearch, Sparkles, Shield, Heart, Zap } from "lucide-react";
import { trackCtaClick } from "@/lib/analytics";

// ─── Navigation ──────────────────────────────────────────────────────

function Nav() {
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
          <Link href="/pricing" className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="relative px-4 py-2 text-sm font-medium text-white transition-colors">
            About
          </Link>
          <Link href="/ai-detector" className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            AI Detector
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() =>
              trackCtaClick({ cta_id: "about-navbar-login", cta_text: "Log in", location: "about-navbar" })
            }
            className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/"
            onClick={() =>
              trackCtaClick({ cta_id: "about-navbar-get-started", cta_text: "Get Started", location: "about-navbar" })
            }
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-500 transition-all"
          >
            Get Started
          </Link>
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

// ─── Main Page ───────────────────────────────────────────────────────

export default function AboutPage() {
  const features = [
    {
      icon: Droplets,
      title: "Scheduled Writing",
      description: "Schedule your content to appear in Google Docs over time. Perfect for creating realistic version history.",
      color: "emerald",
    },
    {
      icon: ScanSearch,
      title: "AI Detection",
      description: "Detect AI-generated content with 99% accuracy and sentence-level highlighting.",
      color: "blue",
    },
    {
      icon: Sparkles,
      title: "Text Humanization",
      description: "Transform AI-generated text to sound more natural and authentic.",
      color: "purple",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Free for Everyone",
      description: "We believe great tools should be accessible to all. Docs Version History is and will remain free for core features.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your content is yours. We never store your text or use it for training.",
    },
    {
      icon: Zap,
      title: "Simplicity",
      description: "Powerful doesn't mean complicated. We design tools that are intuitive from day one.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <Nav />

      {/* Hero */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
            About Us
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-serif font-medium text-white">
            About Docs Version History
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Docs Version History is a powerful writing tool that helps you schedule content
            delivery, detect AI-generated text, and humanize your writing. Built
            for writers, educators, and content creators.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
                Our Mission
              </span>
              <h2 className="mt-2 text-3xl font-serif font-medium text-white">
                Empowering writers with smart tools
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                We believe that great writing tools should be accessible to
                everyone. Docs Version History was created to solve real problems writers face
                every day: scheduling content delivery, understanding AI
                detection, and maintaining authentic voice.
              </p>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Whether you&apos;re a student working on essays, a content
                creator managing deliverables, or an educator reviewing work,
                Docs Version History provides the tools you need to succeed.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Droplets, label: "Scheduled Writing", color: "emerald" },
                { icon: ScanSearch, label: "AI Detection", color: "blue" },
                { icon: Sparkles, label: "Humanization", color: "purple" },
                { icon: Shield, label: "Privacy First", color: "orange" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-gray-800 bg-gray-800/50 p-6 text-center"
                >
                  <item.icon className="mx-auto h-8 w-8 text-emerald-400" />
                  <p className="mt-2 font-semibold text-white">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
              Our Values
            </span>
            <h2 className="mt-2 text-3xl font-serif font-medium text-white">
              What we believe in
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
              What We Offer
            </span>
            <h2 className="mt-2 text-3xl font-serif font-medium text-white">
              Three powerful tools
            </h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-800 bg-gray-800/50 p-8"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                  <feature.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-medium text-white">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Join thousands of writers using Docs Version History. Free forever, no credit card required.
          </p>
          <Link
            href="/"
            onClick={() =>
              trackCtaClick({
                cta_id: "about-cta-get-started",
                cta_text: "Get Started Free",
                location: "about-cta-section",
              })
            }
            className="mt-8 inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3.5 rounded-full font-semibold hover:bg-emerald-500 transition-all"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
