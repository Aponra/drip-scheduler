import type { MetadataRoute } from "next";

/**
 * Robots.txt Configuration
 *
 * Controls how search engine crawlers access the site.
 * Access at: https://docsversionhistory.com/robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://docsversionhistory.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",           // Block API routes
          "/_next/",         // Block Next.js internals
          "/scheduler",      // Block authenticated app pages if any
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
