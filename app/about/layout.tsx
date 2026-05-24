import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Document Version History Tool",
  description:
    "Learn about Docs Version History, the free tool that helps you add realistic version history to Google Docs. Track document changes, create revision history, and monitor writing progress.",
  keywords: [
    "about docs version history",
    "document tracking tool",
    "Google Docs revision tool",
    "writing progress tracker",
  ],
  openGraph: {
    title: "About Docs Version History - Document Tracking Tool",
    description:
      "Learn about the free tool that helps you add realistic version history to Google Docs and track document changes over time.",
    url: "https://docsversionhistory.com/about",
  },
  twitter: {
    title: "About Docs Version History",
    description:
      "Learn about the free tool that helps you add realistic version history to Google Docs.",
  },
  alternates: {
    canonical: "https://docsversionhistory.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
