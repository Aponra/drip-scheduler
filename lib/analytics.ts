/**
 * Google Analytics 4 and Google Ads event tracking helpers.
 */

import { GOOGLE_ADS_ID, CONVERSIONS, type ConversionType } from "./conversion-config";

// Extend window with gtag types
declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      targetId: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Generic GA4 event tracking
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

/**
 * Track Google Ads conversion
 * @param conversionLabel - The conversion label from Google Ads
 * @param value - Optional conversion value (e.g., purchase amount)
 */
export function trackConversion(
  conversionLabel: string,
  value?: number
): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function" && GOOGLE_ADS_ID) {
    window.gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${conversionLabel}`,
      ...(value !== undefined && { value, currency: "USD" }),
    });
  }
}

/**
 * Track sign-up event (GA4 + Google Ads conversion)
 * @param method - The sign-up method (e.g., "google", "email")
 */
export function trackSignUp(method: string): void {
  trackEvent("sign_up", { method });
  trackConversion(CONVERSIONS.SIGN_UP);
}

/**
 * Track login event
 * @param method - The login method (e.g., "google", "email")
 */
export function trackLogin(method: string): void {
  trackEvent("login", { method });
}

/**
 * Track CTA click with detailed context
 */
export function trackCtaClick(params: {
  cta_id: string;
  cta_text: string;
  location: string;
}): void {
  trackEvent("click_cta", {
    cta_id: params.cta_id,
    cta_text: params.cta_text,
    cta_location: params.location,
  });
}

/**
 * Track when a user starts a trial/schedule
 */
export function trackStartTrial(): void {
  trackEvent("start_trial");
  trackConversion(CONVERSIONS.START_TRIAL);
}

/**
 * Track purchase event
 * @param value - Purchase amount
 * @param currency - Currency code (default: USD)
 */
export function trackPurchase(value: number, currency = "USD"): void {
  trackEvent("purchase", { value, currency });
  trackConversion(CONVERSIONS.PURCHASE, value);
}

/**
 * Track schedule creation start
 */
export function trackStartSchedule(): void {
  trackEvent("start_schedule");
  trackConversion(CONVERSIONS.START_SCHEDULE);
}

/**
 * Track Google Docs connection
 */
export function trackConnectDocs(): void {
  trackEvent("connect_docs");
  trackConversion(CONVERSIONS.CONNECT_DOCS);
}

// Re-export official API for convenience
export { sendGAEvent } from "@next/third-parties/google";
