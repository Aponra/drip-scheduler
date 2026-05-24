import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Minimal landing page layout.
 * Landing pages use a simplified layout without the full navigation
 * to maximize conversion focus.
 */
export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
