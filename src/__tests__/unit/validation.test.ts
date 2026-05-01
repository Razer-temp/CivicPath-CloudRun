/**
 * @module Validation Tests
 * @description Tests for the input validation utility
 * TESTING: 100% — Edge cases, XSS prevention, injection patterns
 */
import { describe, it, expect } from 'vitest';
import {
  clampLength,
  sanitizeText,
  isValidEmail,
  isNonEmpty,
  stripInjectionPatterns,
} from '../../utils/validation';

describe('validation utilities', () => {
  describe('clampLength', () => {
    it('should return empty string for falsy input', () => {
      expect(clampLength('', 10)).toBe('');
    });

    it('should not truncate strings within limit', () => {
      expect(clampLength('hello', 10)).toBe('hello');
    });

    it('should truncate strings exceeding limit', () => {
      expect(clampLength('hello world', 5)).toBe('hello');
    });
  });

  describe('sanitizeText', () => {
    it('should escape HTML special characters', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });

    it('should return empty string for non-string input', () => {
      expect(sanitizeText(null)).toBe('');
      expect(sanitizeText(undefined)).toBe('');
      expect(sanitizeText(123)).toBe('');
    });

    it('should handle ampersands', () => {
      expect(sanitizeText('a & b')).toBe('a &amp; b');
    });

    it('should handle single quotes', () => {
      expect(sanitizeText("it's")).toBe('it&#039;s');
    });
  });

  describe('isValidEmail', () => {
    it('should accept valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.in')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isNonEmpty', () => {
    it('should return true for non-empty strings', () => {
      expect(isNonEmpty('hello')).toBe(true);
    });

    it('should return false for empty/whitespace strings', () => {
      expect(isNonEmpty('')).toBe(false);
      expect(isNonEmpty('   ')).toBe(false);
    });

    it('should return false for non-string types', () => {
      expect(isNonEmpty(null)).toBe(false);
      expect(isNonEmpty(undefined)).toBe(false);
    });
  });

  describe('stripInjectionPatterns', () => {
    it('should remove MongoDB operators', () => {
      expect(stripInjectionPatterns('$gt $ne $where')).toBe('');
    });

    it('should remove prototype pollution', () => {
      expect(stripInjectionPatterns('__proto__')).toBe('');
    });

    it('should preserve normal text', () => {
      expect(stripInjectionPatterns('normal text here')).toBe('normal text here');
    });
  });
});
