"use client";

import { trackCtaClick } from "@/lib/analytics";
import type { ReactNode } from "react";

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
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

type LPHeroProps = {
  /** Badge text shown above headline */
  badge?: string;
  /** Main headline - can include JSX for styling */
  headline: ReactNode;
  /** Subheadline text */
  subheadline: string;
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
  /** Trust badges/features to display */
  trustBadges?: string[];
  /** Optional demo component to render below CTA */
  demo?: ReactNode;
};

/**
 * Customizable hero section for landing pages.
 */
export function LPHero({
  badge,
  headline,
  subheadline,
  ctaText,
  onCtaClick,
  ctaHref = "/",
  ctaId,
  location,
  trustBadges = ["100% Free", "No credit card", "Instant access"],
  demo,
}: LPHeroProps) {
  const handleClick = () => {
    trackCtaClick({
      cta_id: ctaId,
      cta_text: ctaText,
      location: `${location}-hero`,
    });
    onCtaClick?.();
  };

  return (
    <section className="pt-16 pb-20 px-6" aria-labelledby="hero-heading">
      <div className="max-w-4xl mx-auto text-center">
        {badge && (
          <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            {badge}
          </span>
        )}

        <h1
          id="hero-heading"
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1]"
        >
          {headline}
        </h1>

        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {subheadline}
        </p>

        <div className="mt-10">
          {onCtaClick ? (
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-emerald-500 transition-colors touch-target"
            >
              {ctaText}
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          ) : (
            <a
              href={ctaHref}
              onClick={handleClick}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-emerald-500 transition-colors touch-target"
            >
              {ctaText}
              <ArrowRightIcon className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* Trust Badges */}
        {trustBadges.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-gray-500">
            {trustBadges.map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-emerald-500" />
                <span className="text-sm">{badge}</span>
              </div>
            ))}
          </div>
        )}

        {/* Optional Demo */}
        {demo && <div className="mt-12">{demo}</div>}
      </div>
    </section>
  );
}

export default LPHero;
