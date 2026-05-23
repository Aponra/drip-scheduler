import type { Metadata } from "next";
import { FAQJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Pricing - Free Google Docs Version History Tool",
  description:
    "Docs Version History is 100% free. Add realistic version history to Google Docs, track document changes, and monitor writing progress at no cost. No credit card required.",
  keywords: [
    "free Google Docs tool",
    "free document version history",
    "free revision tracking",
    "Google Docs version history free",
  ],
  openGraph: {
    title: "Pricing - Free Document Version History Tool",
    description:
      "Docs Version History is completely free. Add version history to Google Docs, track changes, and monitor writing progress at no cost.",
    url: "https://docsversionhistory.com/pricing",
  },
  twitter: {
    title: "Pricing - Free Google Docs Version History",
    description:
      "100% free document version history tool for Google Docs. No credit card required.",
  },
  alternates: {
    canonical: "https://docsversionhistory.com/pricing",
  },
};

const pricingFaqs = [
  {
    question: "Is Docs Version History really free?",
    answer:
      "Yes! Docs Version History is 100% free to use. We believe everyone should have access to great writing tools without paying.",
  },
  {
    question: "Will there be paid plans in the future?",
    answer:
      "We may introduce premium features in the future, but the core functionality will always remain free.",
  },
  {
    question: "Are there any usage limits?",
    answer:
      "Currently, there are no strict limits. We ask that you use the service responsibly.",
  },
  {
    question: "Do I need a credit card to sign up?",
    answer:
      "No credit card required. Just sign in with your Google account and you're ready to go.",
  },
];

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FAQJsonLd faqs={pricingFaqs} />
      {children}
    </>
  );
}
