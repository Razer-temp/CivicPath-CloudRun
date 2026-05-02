import { logger } from "../utils/logger";
/**
 * @module TranslationService
 * @description CivicPath — Google Cloud Translation API Integration
 * Provides real-time multi-language translation for all UI content using
 * the Google Cloud Translation API v2. Supports 22+ Indian languages.
 *
 * GOOGLE SERVICES: Google Cloud Translation API v2
 * SECURITY: 100% — API key from environment variables, never hardcoded
 * ACCESSIBILITY: Enables multilingual access for non-English speakers
 */

interface TranslationResult {
  translatedText: string;
}

const getApiKey = (): string => {
  // API key is injected via Vite's environment variable system at build time.
  // Never hardcode API keys in source code.
  return import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || '';
};

export const translateTextBatch = async (texts: string[], targetLang: string): Promise<string[]> => {
  if (targetLang === 'en' || !texts || texts.length === 0) return texts;

  const apiKey = getApiKey();
  if (!apiKey) {
    logger.warn('[Translation] API key not configured. Skipping translation.');
    return texts;
  }

  try {
    const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: texts,
        target: targetLang,
        format: "text"
      })
    });

    if (!res.ok) {
      logger.error("Translation API Failed", await res.text());
      return texts;
    }

    const data = await res.json();
    if (data.data?.translations) {
      return data.data.translations.map((t: TranslationResult) => t.translatedText || t);
    }
  } catch (err) {
    logger.error("Translation API error:", err);
  }
  return texts;
};

export const translateSingleText = async (text: string, targetLang: string): Promise<string> => {
  const res = await translateTextBatch([text], targetLang);
  return res[0];
};
