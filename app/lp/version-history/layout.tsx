import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Google Docs Version History Tool - Create Realistic Revision History",
  description:
    "Add realistic version history to your Google Docs for free. Schedule text to appear gradually and create authentic document revision tracking. No credit card required.",
  keywords: [
    "google docs version history",
    "document revision history",
    "google docs revision tracking",
    "version history tool",
    "document history creator",
    "writing progress tracker",
  ],
  openGraph: {
    title: "Create Realistic Google Docs Version History",
    description:
      "Free tool to add authentic version history to your Google Docs. Schedule text to appear gradually over time.",
    url: "https://docsversionhistory.com/lp/version-history",
  },
  twitter: {
    title: "Google Docs Version History Tool",
    description:
      "Add realistic version history to your Google Docs for free. Create authentic revision tracking.",
  },
  alternates: {
    canonical: "https://docsversionhistory.com/lp/version-history",
  },
};

export default function VersionHistoryLPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
