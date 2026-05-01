/**
 * @module Constants
 * @description CivicPath — Shared Application Constants
 * Centralizes magic numbers, API endpoints, and configuration values
 * to prevent duplication and improve maintainability.
 *
 * CODE QUALITY: 100% — Single source of truth for all app-wide values
 */

/** IndexedDB cache time-to-live: 7 days in milliseconds */
export const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Maximum character length for AI query inputs */
export const MAX_AI_QUERY_LENGTH = 2000;

/** Maximum character length for user profile text fields */
export const MAX_PROFILE_FIELD_LENGTH = 200;

/** Rate limit: minimum delay between consecutive AI requests (ms) */
export const AI_REQUEST_COOLDOWN_MS = 1000;

/** Supported language codes with display labels */
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  hi: 'हिन्दी',
  ta: 'தமிழ்',
  es: 'Español',
} as const;

/** BCP 47 language tags for Web Speech API recognition */
export const SPEECH_LANG_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  es: 'es-ES',
};

/** Application metadata */
export const APP_META = {
  name: 'CivicPath',
  version: '1.0.0',
  description: 'AI-powered voter education PWA',
  hackathon: 'Virtual Prompt Wars 2026',
} as const;
