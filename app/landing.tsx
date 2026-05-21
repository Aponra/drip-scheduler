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
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
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
  const [inputText, setInputText] = useState("");

  const categories = [
    "Drip Writing",
    "AI Detection",
    "Humanize Text",
    "Import Docs",
    "Google Docs",
  ];

  return (
    <section className="pt-20 pb-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-white leading-[1.1] tracking-tight"
        >
          Write smarter with tools
          <br />
          <span className="text-emerald-400">that understand your flow</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Schedule content to Google Docs, detect AI-generated text, and
          humanize your writing. Three powerful tools, one seamless platform.
        </motion.p>

        {/* Chat Input UI */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="bg-gray-900 rounded-3xl border border-gray-800 shadow-xl shadow-black/20 p-3">
            <div className="flex items-end gap-3">
              <button className="shrink-0 w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-400">
                <Plus className="w-5 h-5" />
              </button>
              <div className="flex-1 min-h-[80px] flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your text here to drip, detect, or humanize..."
                  className="w-full text-white placeholder:text-gray-500 bg-transparent outline-none text-base"
                />
              </div>
              <button
                onClick={() => {
                  trackEvent("hero_cta_click");
                  onGetStarted();
                }}
                className="shrink-0 w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center text-white"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 rounded-full bg-gray-900 border border-gray-800 text-sm font-medium text-gray-400 hover:border-emerald-500 hover:text-emerald-400 transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-500"
        >
          <span className="text-sm">Works with</span>
          <div className="flex items-center gap-6">
            {["Google Docs", "Word", "PDF", "Markdown", "Text"].map((platform) => (
              <span
                key={platform}
                className="text-sm font-medium text-gray-500 hover:text-white transition-colors cursor-default"
              >
                {platform}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Video Feature Section ───────────────────────────────────────────

function VideoFeature() {
  return (
    <section className="py-20 px-6">
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
                See it in action
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-serif font-medium text-white leading-tight">
                The first writing toolkit
                <br />
                built for modern creators
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Watch how Drip transforms your writing workflow with intelligent
                scheduling, detection, and humanization tools.
              </p>
              <button className="mt-8 inline-flex items-center gap-2 text-emerald-400 font-semibold hover:gap-3 transition-all">
                Watch the demo
                <ArrowRight className="w-4 h-4" />
              </button>
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
      title: "Drip Writing",
      icon: Droplets,
      description:
        "Schedule your content to appear in Google Docs over time. Set custom durations from 30 minutes to a full week.",
      benefits: [
        "Create realistic version history",
        "Schedule content delivery",
        "Preserve all formatting",
        "Works with any text length",
      ],
    },
    {
      id: "detect",
      number: "02",
      title: "AI Detection",
      icon: ScanSearch,
      description:
        "Detect AI-generated content with 99% accuracy. See exactly which sentences might be flagged.",
      benefits: [
        "99% detection accuracy",
        "Sentence-level highlighting",
        "Detailed explanations",
        "Instant results",
      ],
    },
    {
      id: "humanize",
      number: "03",
      title: "Text Humanization",
      icon: Sparkles,
      description:
        "Transform AI-generated text to sound natural and authentic while preserving your original meaning.",
      benefits: [
        "Natural-sounding output",
        "Preserves original meaning",
        "Multiple rewrite styles",
        "One-click humanization",
      ],
    },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
            Features
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif font-medium text-white">
            What Drip can do for you
          </h2>
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
      title: "Import or write",
      description: "Paste text, upload files, or write directly in our editor.",
    },
    {
      icon: Clock,
      title: "Choose your tool",
      description: "Drip to Docs, detect AI, or humanize your content.",
    },
    {
      icon: Zap,
      title: "Get results",
      description: "Instant processing with beautiful, actionable output.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
            How it works
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif font-medium text-white">
            Three steps. Endless possibilities.
          </h2>
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
      title: "Students",
      description:
        "Create realistic writing timelines for essays and assignments. Understand AI detection before submission.",
      featured: false,
    },
    {
      icon: PenTool,
      title: "Content Creators",
      description:
        "Humanize AI-assisted content while maintaining your unique voice. Schedule content delivery effortlessly.",
      featured: true,
    },
    {
      icon: Users,
      title: "Educators",
      description:
        "Detect AI-generated submissions with sentence-level accuracy. Understand how students are using AI tools.",
      featured: false,
    },
  ];

  return (
    <section className="py-24 px-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
            Who uses Drip
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif font-medium text-white">
            Built for creators of all kinds
          </h2>
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

// ─── CTA Section ─────────────────────────────────────────────────────

function CTA({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-serif font-medium text-white leading-tight">
          Your smartest writing companion
          <br />
          is ready to start
        </h2>
        <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto">
          Join thousands of writers using Drip. Free forever, no credit card required.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="bg-emerald-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-emerald-500 transition-all hover:shadow-xl hover:shadow-emerald-600/25"
          >
            Start Free
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
  const footerLinks = {
    Product: ["Features", "Pricing", "AI Detector"],
    Company: ["About", "Blog", "Contact"],
    Legal: ["Privacy", "Terms"],
  };

  return (
    <footer className="bg-[#1a1a1a] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Drip</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Write smarter with tools that understand your flow.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replace(" ", "-")}`}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">&copy; 2026 Drip. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-white/40 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/40 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
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
      <Hero onGetStarted={onContinueWithGoogle} />
      <VideoFeature />
      <Features />
      <HowItWorks />
      <Personas />
      <CTA onGetStarted={onContinueWithGoogle} />
      <Footer />
    </div>
  );
}
