"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

type Props = {
  onContinueWithGoogle: () => void;
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

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 3v12" />
      <path d="M7 8l5-5 5 5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function DocsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

// ─── Section components ──────────────────────────────────────────────

function Nav({ onContinueWithGoogle }: Props) {
  return (
    <header className="relative z-10 border-b border-gray-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2.5">
          <LogoIcon className="h-7 w-7" />
          <span className="text-base font-semibold tracking-tight text-gray-900">
            Docs Version History
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#how-it-works"
            className="hidden rounded-md px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:inline-block"
          >
            How it works
          </a>
          <a
            href="#features"
            className="hidden rounded-md px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:inline-block"
          >
            Features
          </a>
          <a
            href="#faq"
            className="hidden rounded-md px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:inline-block"
          >
            FAQ
          </a>
          <button
            onClick={onContinueWithGoogle}
            className="ml-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-50 hover:shadow"
          >
            Log in
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ onContinueWithGoogle }: Props) {
  return (
    <section className="relative overflow-hidden">
      {/* Soft top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/40 via-violet-200/30 to-fuchsia-200/30 blur-3xl"
      />
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Free to use
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Drip your writing into Google Docs.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Pace your prose. Save schedules. Stream a draft into a Google Doc
              over minutes, hours, or days &mdash; on the schedule you choose.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  trackEvent("cta_click", {
                    button_name: "start_for_free",
                    location: "hero_section",
                  });
                  onContinueWithGoogle();
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:bg-blue-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Start for free
                <ArrowRightIcon className="h-4 w-4" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                See how it works
              </a>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Sign in with Google. No credit card. Disconnect anytime.
            </p>
          </div>

          <div className="animate-fade-in-up [animation-delay:120ms]">
            <HeroPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      {/* Decorative offset card behind */}
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 opacity-60 blur-sm"
      />
      <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-xl shadow-blue-100/40 ring-1 ring-black/[0.02]">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <div className="h-2 w-2 rounded-full bg-amber-400" />
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs text-gray-400">
            docsversionhistory.com
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
            Title
          </div>
          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800">
            Chapter Sixteen: Therapies
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {["30 min", "1 hr", "2 hrs", "6 hrs", "1 day"].map((d, i) => (
              <span
                key={d}
                className={
                  i === 1
                    ? "rounded-full bg-blue-600 px-2.5 py-1 text-xs font-medium text-white"
                    : "rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600"
                }
              >
                {d}
              </span>
            ))}
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-700">
              <span>
                Writing to Google Docs:{" "}
                <span className="font-semibold tabular-nums text-gray-900">
                  12 / 47
                </span>{" "}
                blocks
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                Open Google Doc
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-3 w-3"
                >
                  <path d="M14 3h7v7" />
                  <path d="M10 14L21 3" />
                  <path d="M21 14v7H3V3h7" />
                </svg>
              </span>
            </div>
          </div>

          <ul className="space-y-1.5 text-xs text-gray-700">
            {[
              "The first session began with breathing exercises.",
              "The therapist explained what to expect.",
              "By the second meeting the work felt steadier.",
            ].map((line, i) => (
              <li key={i} className="flex gap-2 px-1">
                <span className="font-mono text-[10px] text-gray-400">
                  #{i + 1}
                </span>
                <span className="line-clamp-1">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Connect Google Docs",
      body: "Sign in with Google and grant access to a Docs scope limited to documents this app creates.",
    },
    {
      n: "02",
      title: "Write or import",
      body: "Type in the rich editor or import a .txt, .md, .docx, or .pdf. Bold, headings, and lists carry over.",
    },
    {
      n: "03",
      title: "Pick a duration and start",
      body: "Choose 30 minutes to a full week. Click Start. Your text streams into a fresh Google Doc on schedule.",
    },
  ];
  return (
    <section
      id="how-it-works"
      className="relative border-t border-gray-100 bg-white py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-700">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Three steps from blank doc to finished draft.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md animate-fade-in-up"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="text-xs font-semibold tracking-wider text-blue-600">
                {s.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: ClockIcon,
      title: "Schedule any duration",
      body: "Pick from 30 minutes to a full week, or set a custom interval per chunk. The app figures out the pace.",
    },
    {
      icon: UploadIcon,
      title: "Import existing drafts",
      body: ".txt, .md, .docx, and .pdf, parsed entirely in your browser. Files never touch our servers.",
    },
    {
      icon: DocsIcon,
      title: "Format-aware export",
      body: "Bold, italics, underline, headings, bullet and numbered lists, links, and colors arrive in Google Docs intact.",
    },
    {
      icon: CheckIcon,
      title: "Save and resume",
      body: "Save your schedules, load them later, and pick up where you left off without re-pasting your text.",
    },
    {
      icon: ArrowRightIcon,
      title: "Reliable writes",
      body: "Built-in retries with exponential backoff. If a chunk fails, the next one still goes through.",
    },
    {
      icon: GoogleGIcon,
      title: "Limited Google access",
      body: "We use the drive.file scope, so the app can only read or modify documents it created itself.",
    },
  ];
  return (
    <section
      id="features"
      className="relative border-t border-gray-100 bg-gray-50/40 py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-700">
            Features
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Built for writers who want to plan their work.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600">
            Everything you need to schedule, import, and write into Google Docs
            &mdash; with formatting that survives the trip.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <div
                key={it.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {it.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    {
      q: "What is Docs Version History?",
      a: "A scheduling tool that streams your writing into a Google Doc over a duration you pick. You write or import the source content, choose a total duration, and the app drips it into a fresh Google Doc at a calculated interval per chunk.",
    },
    {
      q: "Is it free?",
      a: "Yes. The app is free to use. You sign in with Google and connect Google Docs. No credit card.",
    },
    {
      q: "What can I import?",
      a: ".txt, .md, .docx, and .pdf up to 25 MB. Parsing happens entirely in your browser; the original file never leaves your device.",
    },
    {
      q: "What does the app access in my Google account?",
      a: "Only the drive.file scope. That means the app can read or modify only the documents it itself created. It cannot list, see, or touch the rest of your Drive.",
    },
    {
      q: "Can I disconnect?",
      a: "Yes. Log out from inside the app, or revoke access at any time at myaccount.google.com/permissions.",
    },
    {
      q: "Does the app store my content?",
      a: "Schedules you save are stored in Firestore so you can load them later. OAuth tokens for Google Docs live in HTTP-only cookies in your browser, not on our servers. See the Privacy Policy for details.",
    },
  ];
  return (
    <section
      id="faq"
      className="relative border-t border-gray-100 bg-white py-20"
    >
      <div className="mx-auto max-w-3xl px-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-blue-700">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Questions, answered.
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          {items.map((it) => (
            <details
              key={it.q}
              className="group rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-shadow open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-gray-900">
                {it.q}
                <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-transform group-open:rotate-45">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {it.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner({ onContinueWithGoogle }: Props) {
  return (
    <section className="relative overflow-hidden border-t border-gray-100 bg-white py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[280px] bg-gradient-to-b from-blue-50 via-white to-transparent"
      />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Start your first schedule.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-gray-600">
          Free, no credit card. Sign in with Google to get started.
        </p>
        <div className="mt-7 flex justify-center">
          <button
            onClick={onContinueWithGoogle}
            className="inline-flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-800 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <GoogleGIcon className="h-5 w-5" />
            Continue with Google
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-gray-700 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-gray-700 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <LogoIcon className="h-6 w-6" />
          <span className="text-sm font-semibold tracking-tight text-gray-900">
            Docs Version History
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
          <Link href="/privacy" className="hover:text-gray-900">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-gray-900">
            Terms
          </Link>
          <a
            href="mailto:abuisaapon962974@gmail.com"
            className="hover:text-gray-900"
          >
            Contact
          </a>
          <span className="text-gray-400">© 2026 Apon</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Composition ─────────────────────────────────────────────────────

export default function Landing({ onContinueWithGoogle }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <Nav onContinueWithGoogle={onContinueWithGoogle} />
      <Hero onContinueWithGoogle={onContinueWithGoogle} />
      <HowItWorks />
      <Features />
      <Faq />
      <CtaBanner onContinueWithGoogle={onContinueWithGoogle} />
      <Footer />
    </div>
  );
}
