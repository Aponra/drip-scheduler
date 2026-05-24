"use client";

import Link from "next/link";
import { trackCtaClick } from "@/lib/analytics";

function DropletIcon({ className }: { className?: string }) {
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
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

type LPHeaderProps = {
  /** CTA button text */
  ctaText?: string;
  /** CTA click handler */
  onCtaClick?: () => void;
  /** CTA href (if link instead of button) */
  ctaHref?: string;
  /** CTA tracking ID */
  ctaId: string;
  /** Page location for tracking */
  location: string;
};

/**
 * Minimal landing page header with logo and single CTA.
 * Designed to maximize focus on the conversion action.
 */
export function LPHeader({
  ctaText = "Get Started Free",
  onCtaClick,
  ctaHref = "/",
  ctaId,
  location,
}: LPHeaderProps) {
  const handleClick = () => {
    trackCtaClick({
      cta_id: ctaId,
      cta_text: ctaText,
      location: `${location}-header`,
    });
    onCtaClick?.();
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <DropletIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">
            Docs Version History
          </span>
        </Link>

        {onCtaClick ? (
          <button
            onClick={handleClick}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-500 transition-colors touch-target"
          >
            {ctaText}
          </button>
        ) : (
          <Link
            href={ctaHref}
            onClick={handleClick}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-500 transition-colors touch-target"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </header>
  );
}

export default LPHeader;
