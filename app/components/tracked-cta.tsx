"use client";

import { trackCtaClick } from "@/lib/analytics";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type BaseCtaProps = {
  /** Unique identifier for the CTA */
  ctaId: string;
  /** Button text (used for tracking) */
  ctaText: string;
  /** Location/section where the CTA appears */
  location: string;
  /** Button content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Visual variant */
  variant?: "primary" | "secondary" | "outline";
};

type ButtonCtaProps = BaseCtaProps & {
  /** Click handler for button CTAs */
  onClick: () => void;
  href?: never;
  disabled?: boolean;
};

type LinkCtaProps = BaseCtaProps & {
  /** Href for link CTAs */
  href: string;
  onClick?: never;
  disabled?: never;
};

type TrackedCtaProps = ButtonCtaProps | LinkCtaProps;

const variantStyles = {
  primary:
    "bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-500",
  secondary:
    "bg-gray-800 text-white hover:bg-gray-700 focus-visible:ring-gray-500",
  outline:
    "border border-gray-700 text-white hover:border-emerald-500 focus-visible:ring-emerald-500",
} as const;

const baseStyles =
  "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 touch-target";

/**
 * A CTA button/link that automatically tracks click events to GA4.
 *
 * @example
 * // As a button
 * <TrackedCta
 *   ctaId="hero-get-started"
 *   ctaText="Get Started"
 *   location="hero"
 *   onClick={handleGetStarted}
 * >
 *   Get Started
 * </TrackedCta>
 *
 * @example
 * // As a link
 * <TrackedCta
 *   ctaId="footer-pricing"
 *   ctaText="View Pricing"
 *   location="footer"
 *   href="/pricing"
 *   variant="outline"
 * >
 *   View Pricing
 * </TrackedCta>
 */
export function TrackedCta({
  ctaId,
  ctaText,
  location,
  children,
  className = "",
  variant = "primary",
  ...props
}: TrackedCtaProps) {
  const handleTrack = () => {
    trackCtaClick({
      cta_id: ctaId,
      cta_text: ctaText,
      location,
    });
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  // Link CTA
  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={combinedClassName}
        onClick={handleTrack}
      >
        {children}
      </Link>
    );
  }

  // Button CTA
  const buttonProps = props as ButtonCtaProps;
  return (
    <button
      onClick={() => {
        handleTrack();
        buttonProps.onClick();
      }}
      disabled={buttonProps.disabled}
      className={`${combinedClassName} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export default TrackedCta;
