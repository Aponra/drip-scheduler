/**
 * Google Analytics 4 event tracking helper.
 */

export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams);
  }
}

// Re-export official API for convenience
export { sendGAEvent } from "@next/third-parties/google";
