"use client";

import Link from "next/link";
import { trackCtaClick } from "@/lib/analytics";

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

type LPCtaSectionProps = {
  /** Main heading */
  heading: string;
  /** Subheading text */
  subheading: string;
  /** Primary CTA button text */
  ctaText: string;
  /** Primary CTA click handler */
  onCtaClick?: () => void;
  /** Primary CTA href (if link) */
  ctaHref?: string;
  /** CTA tracking ID */
  ctaId: string;
  /** Page location for tracking */
  location: string;
  /** Optional secondary CTA */
  secondaryCta?: {
    text: string;
    href: string;
    ctaId: string;
  };
};

/**
 * Bottom CTA section with tracking for landing pages.
 */
export function LPCtaSection({
  heading,
  subheading,
  ctaText,
  onCtaClick,
  ctaHref = "/",
  ctaId,
  location,
  secondaryCta,
}: LPCtaSectionProps) {
  const handlePrimaryClick = () => {
    trackCtaClick({
      cta_id: ctaId,
      cta_text: ctaText,
      location: `${location}-cta-section`,
    });
    onCtaClick?.();
  };

  const handleSecondaryClick = () => {
    if (secondaryCta) {
      trackCtaClick({
        cta_id: secondaryCta.ctaId,
        cta_text: secondaryCta.text,
        location: `${location}-cta-section`,
      });
    }
  };

  return (
    <section
      className="py-20 px-6 bg-gradient-to-b from-gray-950 to-gray-900"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          id="cta-heading"
          className="text-3xl md:text-4xl font-bold text-white leading-tight"
        >
          {heading}
        </h2>
        <p className="mt-6 text-lg text-gray-400">{subheading}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {onCtaClick ? (
            <button
              onClick={handlePrimaryClick}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-emerald-500 transition-colors touch-target"
            >
              {ctaText}
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          ) : (
            <Link
              href={ctaHref}
              onClick={handlePrimaryClick}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-emerald-500 transition-colors touch-target"
            >
              {ctaText}
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          )}

          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              onClick={handleSecondaryClick}
              className="px-8 py-4 rounded-full text-base font-semibold text-white border border-gray-700 hover:border-emerald-500 transition-colors touch-target"
            >
              {secondaryCta.text}
            </Link>
          )}
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Free forever. No credit card required.
        </p>
      </div>
    </section>
  );
}

export default LPCtaSection;
