"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Droplets,
  ScanSearch,
  Sparkles,
  Clock,
  FileText,
  Shield,
  Zap,
  GraduationCap,
  PenTool,
  Users,
  ChevronRight,
  Plus,
  Send,
  Check,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Props = {
  onContinueWithGoogle: () => void;
};

// ─── Animation Variants ──────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// ─── Announcement Bar ────────────────────────────────────────────────

function AnnouncementBar() {
  return (
    <div className="bg-emerald-600 text-white py-2.5 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 text-sm">
        <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded">
          NEW
        </span>
        <span className="text-white/90">
          Drip now supports PDF imports with formatting
        </span>
        <ArrowRight className="w-4 h-4 text-white/70" />
      </div>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────

function Navbar({ onGetStarted }: { onGetStarted: () => void }) {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "AI Detector", href: "/ai-detector" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">
            Drip
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
            >
              {item.label}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onGetStarted}
            className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Log in
          </button>
          <button
            onClick={onGetStarted}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-600/25"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────

function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  const [duration, setDuration] = useState("1 hour");

  const durations = ["30 min", "1 hour", "2 hours", "6 hours", "1 day", "1 week"];

  return (
    <section className="pt-16 pb-24 px-6" aria-labelledby="hero-heading">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1]"
        >
          Add Version History to
          <br />
          <span className="text-emerald-400">Your Google Docs</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Create realistic document revision history by drip-feeding text into Google Docs over time.
          Track writing progress and build authentic version history automatically.
        </motion.p>

        {/* Drip Input Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 max-w-3xl mx-auto"
        >
          <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl shadow-black/30 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-800/50 px-5 py-3 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Drip to Google Docs</p>
                  <p className="text-xs text-gray-500">Your text will appear gradually over time</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
            </div>

            {/* Text Area */}
            <div className="p-5">
              <textarea
                placeholder="Paste your essay, assignment, or any text here..."
                rows={5}
                className="w-full bg-transparent text-white placeholder:text-gray-600 outline-none resize-none text-base leading-relaxed"
              />
            </div>

            {/* Duration Selection */}
            <div className="px-5 py-3 border-t border-gray-800 bg-gray-800/30">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Drip over:</span>
                <div className="flex flex-wrap gap-2">
                  {durations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        duration === d
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 text-sm">
                  <Plus className="w-4 h-4" />
                  Upload file
                </button>
                <span className="text-xs text-gray-600">.txt, .docx, .pdf</span>
              </div>
              <button
                onClick={() => {
                  trackEvent("hero_cta_click", { duration });
                  onGetStarted();
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-all text-white font-semibold text-sm"
              >
                Start Dripping
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Helper Text */}
          <p className="mt-4 text-sm text-gray-500">
            Text will be written to a new Google Doc sentence by sentence over your chosen duration
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-500"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">100% Free</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">No credit card</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">Creates real version history</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── What Is Section ─────────────────────────────────────────────────

function WhatIsSection() {
  return (
    <section className="py-20 px-6" aria-labelledby="what-is-heading">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="bg-gray-900 rounded-[2rem] border border-gray-800 shadow-xl shadow-black/20 overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
                Document Version Tracking
              </span>
              <h2 id="what-is-heading" className="mt-4 text-3xl md:text-4xl font-bold text-white leading-tight">
                What is Google Docs
                <br />
                Version History?
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Google Docs automatically tracks every change you make to a document,
                creating a <strong className="text-gray-300">revision history</strong> that shows when and how your
                document evolved. Our tool helps you create authentic version history
                by gradually inserting text over time—perfect for demonstrating your
                writing process.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:gap-3 transition-all"
                >
                  Learn more about us
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 min-h-[300px] md:min-h-[400px] flex items-center justify-center">
              <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors group">
                <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features Section ────────────────────────────────────────────────

function Features() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      id: "drip",
      number: "01",
      title: "Document Version History Creator",
      icon: Droplets,
      description:
        "Build authentic Google Docs revision history by scheduling text to appear gradually. Perfect for tracking document changes and demonstrating your writing progress over time.",
      benefits: [
        "Create realistic revision history",
        "Track document changes over time",
        "Schedule content from 30 min to 1 week",
        "Export directly to Google Docs",
      ],
      link: null,
    },
    {
      id: "detect",
      number: "02",
      title: "AI Content Detection",
      icon: ScanSearch,
      description:
        "Detect AI-generated content with industry-leading 99% accuracy. Our AI detector highlights exactly which sentences may be flagged as machine-written.",
      benefits: [
        "99% AI detection accuracy",
        "Sentence-level highlighting",
        "Works with ChatGPT, Claude & more",
        "Instant analysis results",
      ],
      link: "/ai-detector",
    },
    {
      id: "humanize",
      number: "03",
      title: "Text Humanization",
      icon: Sparkles,
      description:
        "Transform AI-generated text into natural, human-sounding content. Maintain your original meaning while making your writing undetectable.",
      benefits: [
        "Natural-sounding output",
        "Preserves original meaning",
        "Bypass AI detection tools",
        "One-click transformation",
      ],
      link: "/ai-detector",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-gray-900" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
            Powerful Features
          </span>
          <h2 id="features-heading" className="mt-4 text-4xl md:text-5xl font-bold text-white">
            Track Document Changes & Build Version History
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to create realistic Google Docs revision history,
            detect AI content, and humanize your writing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Tab Navigation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-2"
          >
            {features.map((feature, i) => (
              <motion.button
                key={feature.id}
                variants={fadeInUp}
                onClick={() => setActiveTab(i)}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  activeTab === i
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-emerald-500"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-semibold ${
                      activeTab === i ? "text-white/60" : "text-gray-500"
                    }`}
                  >
                    {feature.number}
                  </span>
                  <span className="font-semibold">{feature.title}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Feature Preview */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-800 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center">
                {(() => {
                  const IconComponent = features[activeTab].icon;
                  return <IconComponent className="w-6 h-6 text-white" />;
                })()}
              </div>
              <div>
                <h3 className="text-2xl font-serif font-medium text-white">
                  {features[activeTab].title}
                </h3>
                <p className="mt-2 text-gray-400">
                  {features[activeTab].description}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {features[activeTab].benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 bg-gray-900 rounded-xl p-4 border border-gray-700"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {features[activeTab].link && (
              <Link
                href={features[activeTab].link}
                className="mt-6 inline-flex items-center gap-2 text-emerald-400 font-semibold hover:gap-3 transition-all"
              >
                Try {features[activeTab].title}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "Import your document",
      description: "Paste text, upload .txt, .docx, or .pdf files. We preserve your formatting.",
    },
    {
      icon: Clock,
      title: "Set your schedule",
      description: "Choose how long to drip your content—from 30 minutes to a full week.",
    },
    {
      icon: Zap,
      title: "Build version history",
      description: "Watch as your document gains authentic revision history in Google Docs.",
    },
  ];

  return (
    <section className="py-24 px-6" aria-labelledby="how-it-works-heading">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
            How It Works
          </span>
          <h2 id="how-it-works-heading" className="mt-4 text-4xl md:text-5xl font-bold text-white">
            Create Google Docs Revision History in 3 Steps
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Our document history tool makes it easy to build authentic version tracking.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={fadeInUp}
              className="bg-gray-900 rounded-3xl border border-gray-800 p-8 text-center hover:border-gray-700 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-7 h-7 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Step {i + 1}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── User Personas ───────────────────────────────────────────────────

function Personas() {
  const personas = [
    {
      icon: GraduationCap,
      title: "Students & Academics",
      description:
        "Build authentic document revision history for essays and research papers. Show your writing progress and track changes over time.",
      featured: false,
    },
    {
      icon: PenTool,
      title: "Writers & Content Creators",
      description:
        "Create realistic version history for your documents. Perfect for demonstrating your writing process to editors and clients.",
      featured: true,
    },
    {
      icon: Users,
      title: "Teams & Educators",
      description:
        "Track document changes across your organization. Use our AI detector to understand AI-assisted content in submissions.",
      featured: false,
    },
  ];

  return (
    <section className="py-24 px-6 bg-gray-900" aria-labelledby="personas-heading">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
            Who Uses Our Tool
          </span>
          <h2 id="personas-heading" className="mt-4 text-4xl md:text-5xl font-bold text-white">
            Trusted by Writers Who Need Version History
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            From students to professionals—anyone who needs to track document changes.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6 items-stretch"
        >
          {personas.map((persona) => (
            <motion.div
              key={persona.title}
              variants={fadeInUp}
              className={`rounded-3xl border p-8 transition-all ${
                persona.featured
                  ? "bg-emerald-600 border-emerald-600 text-white md:scale-105"
                  : "bg-gray-800 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  persona.featured ? "bg-white/20" : "bg-gray-700"
                }`}
              >
                <persona.icon
                  className={`w-7 h-7 ${
                    persona.featured ? "text-white" : "text-emerald-400"
                  }`}
                />
              </div>
              <h3
                className={`text-xl font-semibold ${
                  persona.featured ? "text-white" : "text-white"
                }`}
              >
                {persona.title}
              </h3>
              <p
                className={`mt-3 leading-relaxed ${
                  persona.featured ? "text-white/80" : "text-gray-400"
                }`}
              >
                {persona.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────

function FAQ() {
  const faqs = [
    {
      question: "What is Google Docs version history?",
      answer:
        "Google Docs version history is a feature that automatically tracks every change made to a document. It shows who made changes, when they were made, and allows you to restore previous versions. Our tool helps you create authentic version history by gradually inserting text over time.",
    },
    {
      question: "How does the document version tracking work?",
      answer:
        "You paste or upload your text, choose a duration (from 30 minutes to 1 week), and our tool drip-feeds the content into a new Google Doc sentence by sentence. This creates a realistic revision history that shows your document being written over time.",
    },
    {
      question: "Can I track changes in my existing Google Docs?",
      answer:
        "Our tool creates new Google Docs with built-in version history. You can then use Google's native version history feature to see exactly how and when each part of your document was added.",
    },
    {
      question: "Is the AI content detector accurate?",
      answer:
        "Yes, our AI detector achieves 99% accuracy in identifying AI-generated content. It provides sentence-level highlighting so you can see exactly which parts of your text may be flagged as machine-written.",
    },
    {
      question: "Is Docs Version History free to use?",
      answer:
        "Yes! Our document history tool is completely free. No credit card required. Just sign in with your Google account and start creating version history for your documents.",
    },
  ];

  return (
    <section className="py-24 px-6" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
            FAQ
          </span>
          <h2 id="faq-heading" className="mt-4 text-3xl md:text-4xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-400">
            Everything you need to know about creating document version history.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-4"
        >
          {faqs.map((faq) => (
            <motion.details
              key={faq.question}
              variants={fadeInUp}
              className="group rounded-2xl border border-gray-800 bg-gray-900 px-6 py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-white">
                <span>{faq.question}</span>
                <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-transform group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="mt-4 text-gray-400 leading-relaxed">{faq.answer}</p>
            </motion.details>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-gray-500"
        >
          Have more questions?{" "}
          <Link href="/about" className="text-emerald-400 hover:underline">
            Contact us
          </Link>
        </motion.p>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────

function CTA({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-24 px-6 bg-gray-900" aria-labelledby="cta-heading">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 id="cta-heading" className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Start Building Document
          <br />
          Version History Today
        </h2>
        <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto">
          Join thousands of users creating realistic Google Docs revision history.
          Free forever, no credit card required.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="bg-emerald-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-emerald-500 transition-all hover:shadow-xl hover:shadow-emerald-600/25"
          >
            Create Version History Free
          </button>
          <Link
            href="/pricing"
            className="px-8 py-4 rounded-full text-base font-semibold text-white border border-gray-700 hover:border-emerald-500 transition-all"
          >
            View Pricing
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#0d0d0d] text-white py-16 px-6" role="contentinfo">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Docs Version History</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Create realistic Google Docs revision history. Track document changes
              and build authentic version history for your writing.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-white/60 hover:text-white text-sm transition-colors">
                  Version History Creator
                </Link>
              </li>
              <li>
                <Link href="/ai-detector" className="text-white/60 hover:text-white text-sm transition-colors">
                  AI Content Detector
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-white/60 hover:text-white text-sm transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-white/60 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#faq-heading" className="text-white/60 hover:text-white text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works-heading" className="text-white/60 hover:text-white text-sm transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Docs Version History. Free Google Docs version history tool.
          </p>
          <p className="text-white/30 text-xs">
            Track document changes · Create revision history · Writing progress tracker
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Component ──────────────────────────────────────────

export default function Landing({ onContinueWithGoogle }: Props) {
  return (
    <div className="min-h-screen bg-gray-950">
      <AnnouncementBar />
      <Navbar onGetStarted={onContinueWithGoogle} />
      <main>
        <Hero onGetStarted={onContinueWithGoogle} />
        <WhatIsSection />
        <Features />
        <HowItWorks />
        <Personas />
        <FAQ />
        <CTA onGetStarted={onContinueWithGoogle} />
      </main>
      <Footer />
    </div>
  );
}
