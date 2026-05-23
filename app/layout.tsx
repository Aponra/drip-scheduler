import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { WebsiteJsonLd, SoftwareAppJsonLd, HomepageFAQJsonLd } from "@/lib/structured-data";

// Optimize font loading with display swap to prevent FOIT
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Only preload primary font
});

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

const siteUrl = "https://docsversionhistory.com";
const siteName = "Docs Version History";
const siteDescription =
  "Add realistic version history to your Google Docs. Schedule and drip-feed text gradually to create authentic document revision history and track writing progress over time.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Add Version History to Google Docs`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "Google Docs version history",
    "document version tracking",
    "Google Docs revision history",
    "track document changes",
    "writing progress tracker",
    "document history tool",
    "drip feed text",
    "gradual text insertion",
    "Google Docs automation",
    "document scheduling",
  ],
  authors: [{ name: "Docs Version History" }],
  creator: "Docs Version History",
  publisher: "Docs Version History",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - Add Version History to Google Docs`,
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Docs Version History - Add realistic version history to your Google Docs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Add Version History to Google Docs`,
    description: siteDescription,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://apis.google.com" />
        {/* DNS prefetch for non-critical origins */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className="min-h-full flex flex-col bg-[#F9FAFB] text-gray-900">
        {/* Skip link for keyboard accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <WebsiteJsonLd />
        <SoftwareAppJsonLd />
        <HomepageFAQJsonLd />
        <AuthProvider>{children}</AuthProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
