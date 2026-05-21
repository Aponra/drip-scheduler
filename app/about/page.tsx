import Link from "next/link";

export const metadata = {
  title: "About · Drip",
  description: "Learn about Drip and our mission to help writers.",
};

// ─── Icons & Components ──────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <rect width="24" height="24" rx="5" fill="#10B981" />
        <path
          d="M12 5C9.4 8 7.5 11 7.5 14a4.5 4.5 0 0 0 9 0c0-3-1.9-6-4.5-9z"
          fill="#fff"
        />
      </svg>
      <span className="text-lg font-bold tracking-tight text-white">Drip</span>
    </Link>
  );
}

function DropletIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function ScanIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
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
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-gray-800 transition-colors"
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
          <Link
            href="/"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-500"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            About Drip
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Drip is a powerful writing tool that helps you schedule content
            delivery, detect AI-generated text, and humanize your writing. Built
            for writers, educators, and content creators who want more control
            over their work.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-950 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
                Our Mission
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                Empowering writers with smart tools
              </h2>
              <p className="mt-4 leading-relaxed text-gray-400">
                We believe that great writing tools should be accessible to
                everyone. Drip was created to solve real problems writers face
                every day: scheduling content delivery, understanding AI
                detection, and maintaining authentic voice in their work.
              </p>
              <p className="mt-4 leading-relaxed text-gray-400">
                Whether you&apos;re a student working on essays, a content
                creator managing deliverables, or an educator reviewing student
                work, Drip provides the tools you need to succeed.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: DropletIcon, label: "Drip Writing", color: "emerald" },
                { icon: ScanIcon, label: "AI Detection", color: "blue" },
                { icon: SparklesIcon, label: "Humanization", color: "purple" },
                { icon: ShieldIcon, label: "Privacy First", color: "orange" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl border p-6 text-center ${
                    item.color === "emerald"
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : item.color === "blue"
                        ? "border-blue-500/30 bg-blue-500/10"
                        : item.color === "purple"
                          ? "border-purple-500/30 bg-purple-500/10"
                          : "border-orange-500/30 bg-orange-500/10"
                  }`}
                >
                  <item.icon
                    className={`mx-auto h-8 w-8 ${
                      item.color === "emerald"
                        ? "text-emerald-400"
                        : item.color === "blue"
                          ? "text-blue-400"
                          : item.color === "purple"
                            ? "text-purple-400"
                            : "text-orange-400"
                    }`}
                  />
                  <p className="mt-2 font-semibold text-white">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-900 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
              Our Values
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
              What we believe in
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: HeartIcon,
                title: "Free for Everyone",
                description:
                  "We believe great tools should be accessible to all. Drip is and will remain free for core features.",
              },
              {
                icon: ShieldIcon,
                title: "Privacy First",
                description:
                  "Your content is yours. We never store your text or use it for training. Everything is processed securely.",
              },
              {
                icon: ZapIcon,
                title: "Simplicity",
                description:
                  "Powerful doesn't mean complicated. We design tools that are intuitive and easy to use from day one.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-gray-800 bg-gray-800/50 p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="bg-gray-950 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
              What We Offer
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Three tools, one platform
            </h2>
          </div>

          <div className="mt-12 space-y-8">
            {[
              {
                icon: DropletIcon,
                title: "Drip Writing",
                description:
                  "Schedule your content to appear in Google Docs over time. Set custom durations from 30 minutes to a full week. Perfect for simulating real-time writing, pacing content delivery, or creating realistic version history.",
                color: "emerald",
              },
              {
                icon: ScanIcon,
                title: "AI Detection",
                description:
                  "Detect AI-generated content with 99% accuracy. Our sentence-level highlighting shows you exactly which parts might be flagged. Understand how AI detectors see your text before you submit.",
                color: "blue",
              },
              {
                icon: SparklesIcon,
                title: "Text Humanization",
                description:
                  "Transform AI-generated text to sound more natural and authentic. Preserve your original meaning while adjusting the style to match human writing patterns.",
                color: "purple",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`flex flex-col gap-6 rounded-2xl border p-8 md:flex-row md:items-center ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                } ${
                  feature.color === "emerald"
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : feature.color === "blue"
                      ? "border-blue-500/20 bg-blue-500/5"
                      : "border-purple-500/20 bg-purple-500/5"
                }`}
              >
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${
                    feature.color === "emerald"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : feature.color === "blue"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  <feature.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Join thousands of writers using Drip. Free forever, no credit card
            required.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <Logo />
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/about" className="hover:text-white">
              About
            </Link>
            <Link href="/ai-detector" className="hover:text-white">
              AI Detector
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </nav>
          <p className="text-sm text-gray-500">&copy; 2026 Drip</p>
        </div>
      </footer>
    </div>
  );
}
