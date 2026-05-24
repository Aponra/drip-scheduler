import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Writing Tool - Track Essay & Paper Progress Free",
  description:
    "Free writing tool for students. Track your essay and research paper progress with authentic version history. Document your writing journey for academic success.",
  keywords: [
    "student writing tool",
    "essay version history",
    "academic writing tracker",
    "research paper tool",
    "student essay tool",
    "writing progress tracker",
    "academic document tracking",
  ],
  openGraph: {
    title: "Student Writing Tool - Track Your Academic Progress",
    description:
      "Free tool for students to track essay and research paper progress with authentic version history.",
    url: "https://docsversionhistory.com/lp/students",
  },
  twitter: {
    title: "Student Writing Tool - Free",
    description:
      "Track your essay and research paper progress with authentic version history.",
  },
  alternates: {
    canonical: "https://docsversionhistory.com/lp/students",
  },
};

export default function StudentsLPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
