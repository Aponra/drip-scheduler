/**
 * Google Ads Conversion Configuration
 *
 * Centralized configuration for all conversion tracking labels.
 * Update these values with your actual Google Ads conversion IDs.
 */

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

/**
 * Conversion labels for Google Ads tracking.
 * Replace placeholder values with actual conversion labels from Google Ads.
 *
 * To get your conversion labels:
 * 1. Go to Google Ads > Goals > Conversions
 * 2. Create or select a conversion action
 * 3. Copy the conversion label from the tag setup
 */
export const CONVERSIONS = {
  /** Tracks when a new user signs up */
  SIGN_UP: "sign_up_conversion_label",
  /** Tracks when a user starts scheduling content */
  START_SCHEDULE: "start_schedule_conversion_label",
  /** Tracks when a user connects their Google Docs */
  CONNECT_DOCS: "connect_docs_conversion_label",
  /** Tracks when a user starts a free trial */
  START_TRIAL: "start_trial_conversion_label",
  /** Tracks a purchase event */
  PURCHASE: "purchase_conversion_label",
} as const;

export type ConversionType = keyof typeof CONVERSIONS;
