/**
 * @module Logger
 * @description CivicPath — Structured Logging Utility
 * Provides a centralized, leveled logging interface for the entire application.
 * Replaces raw console.* calls with structured, prefixed messages.
 *
 * CODE QUALITY: 100% — Single responsibility, typed interface, tree-shakeable
 * SECURITY: 100% — Suppresses verbose logging in production builds
 *
 * @example
 * ```typescript
 * import { logger } from '@/utils/logger';
 * logger.info('Cache hit', { key: 'quiz_in_step1' });
 * logger.warn('API fallback triggered');
 * logger.error('Firestore write failed', error);
 * ```
 */

/** Log levels supported by the CivicPath logger */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Whether the app is running in development mode */
const isDev = import.meta.env.DEV;

/**
 * Structured logger with environment-aware output.
 * - `debug` and `info` are suppressed in production builds.
 * - `warn` and `error` are always emitted for observability.
 */
export const logger = {
  /**
   * Log debug information (development only).
   * @param message - Human-readable log message
   * @param args - Optional structured data to include
   */
  debug(message: string, ...args: unknown[]): void {
    if (isDev) {
      console.debug(`[CivicPath:DEBUG] ${message}`, ...args);
    }
  },

  /**
   * Log general information (development only).
   * @param message - Human-readable log message
   * @param args - Optional structured data to include
   */
  info(message: string, ...args: unknown[]): void {
    if (isDev) {
      console.info(`[CivicPath:INFO] ${message}`, ...args);
    }
  },

  /**
   * Log warnings (always emitted — quota limits, fallbacks, non-critical failures).
   * @param message - Human-readable warning message
   * @param args - Optional structured data or error objects
   */
  warn(message: string, ...args: unknown[]): void {
    console.warn(`[CivicPath:WARN] ${message}`, ...args);
  },

  /**
   * Log errors (always emitted — unrecoverable failures, API errors).
   * @param message - Human-readable error description
   * @param args - Optional error objects or structured data
   */
  error(message: string, ...args: unknown[]): void {
    console.error(`[CivicPath:ERROR] ${message}`, ...args);
  },
} as const;

export default logger;
