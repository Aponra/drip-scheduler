import Link from "next/link";

export const metadata = {
  title: "About · Drip",
  description: "Learn about Drip and our mission to help writers.",
};

// ─── Icons ───────────────────────────────────────────────────────────

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

// ─── Navigation ──────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
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
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            href="/#features"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100"
          >
            About
          </Link>
          <Link
            href="/ai-detector"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            AI Detector
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 sm:block"
          >
            Log in
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
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
    <footer className="border-t border-gray-100 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon className="h-7 w-7" />
          <span className="text-base font-semibold text-gray-900">Drip</span>
        </Link>
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
          <Link href="/ai-detector" className="hover:text-gray-900">
            AI Detector
          </Link>
          <Link href="/privacy" className="hover:text-gray-900">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-gray-900">
            Terms
          </Link>
        </nav>
        <p className="text-sm text-gray-400">&copy; 2026 Drip</p>
      </div>
    </footer>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function AboutPage() {
  const features = [
    {
      icon: DropletIcon,
      title: "Drip Writing",
      description:
        "Schedule your content to appear in Google Docs over time. Set custom durations from 30 minutes to a full week. Perfect for creating realistic version history.",
      color: "blue",
      benefits: [
        "Create realistic writing timelines",
        "Schedule content delivery",
        "Import .txt, .md, .docx, .pdf",
        "Preserve formatting",
      ],
    },
    {
      icon: ScanIcon,
      title: "AI Detection",
      description:
        "Detect AI-generated content with 99% accuracy. Our sentence-level highlighting shows you exactly which parts might be flagged by AI detectors.",
      color: "purple",
      benefits: [
        "99% detection accuracy",
        "Sentence-level analysis",
        "Color-coded highlighting",
        "Detailed explanations",
      ],
    },
    {
      icon: SparklesIcon,
      title: "Text Humanization",
      description:
        "Transform AI-generated text to sound more natural and authentic. Preserve your original meaning while adjusting the style to match human writing patterns.",
      color: "emerald",
      benefits: [
        "Natural-sounding output",
        "Preserves meaning",
        "Bypasses AI detection",
        "One-click rewriting",
      ],
    },
  ];

  const colors = {
    blue: {
      bg: "bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
      check: "text-blue-600",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "bg-purple-100 text-purple-600",
      check: "text-purple-600",
    },
    emerald: {
      bg: "bg-emerald-50",
      icon: "bg-emerald-100 text-emerald-600",
      check: "text-emerald-600",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            About Us
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            About Drip
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Drip is a powerful writing tool that helps you schedule content
            delivery, detect AI-generated text, and humanize your writing. Built
            for writers, educators, and content creators who want more control
            over their work.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Our Mission
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                Empowering writers with smart tools
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                We believe that great writing tools should be accessible to
                everyone. Drip was created to solve real problems writers face
                every day: scheduling content delivery, understanding AI
                detection, and maintaining authentic voice in their work.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Whether you&apos;re a student working on essays, a content
                creator managing deliverables, or an educator reviewing student
                work, Drip provides the tools you need to succeed.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: DropletIcon, label: "Drip Writing", color: "blue" },
                { icon: ScanIcon, label: "AI Detection", color: "purple" },
                { icon: SparklesIcon, label: "Humanization", color: "emerald" },
                { icon: ShieldIcon, label: "Privacy First", color: "orange" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl border p-6 text-center ${
                    item.color === "blue"
                      ? "border-blue-100 bg-blue-50"
                      : item.color === "purple"
                        ? "border-purple-100 bg-purple-50"
                        : item.color === "emerald"
                          ? "border-emerald-100 bg-emerald-50"
                          : "border-orange-100 bg-orange-50"
                  }`}
                >
                  <item.icon
                    className={`mx-auto h-8 w-8 ${
                      item.color === "blue"
                        ? "text-blue-600"
                        : item.color === "purple"
                          ? "text-purple-600"
                          : item.color === "emerald"
                            ? "text-emerald-600"
                            : "text-orange-600"
                    }`}
                  />
                  <p className="mt-2 font-semibold text-gray-900">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Our Values
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
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
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              What We Offer
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Three powerful tools, one platform
            </h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {features.map((feature) => {
              const colorClasses = colors[feature.color as keyof typeof colors];
              return (
                <div
                  key={feature.title}
                  className={`rounded-2xl border border-gray-100 p-8 ${colorClasses.bg}`}
                >
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses.icon}`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {feature.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2">
                        <CheckIcon
                          className={`h-4 w-4 ${colorClasses.check}`}
                        />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-b from-white to-blue-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of writers using Drip. Free forever, no credit card
            required.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
