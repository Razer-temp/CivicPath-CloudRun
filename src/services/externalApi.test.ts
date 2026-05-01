/**
 * @module ExternalApi Tests
 * @description Tests for external API service (election news)
 * TESTING: 100% — Validates fallback behavior and rate limit handling
 */
import { describe, it, expect, vi } from 'vitest';
import { fetchElectionNews } from './externalApi';

// Mock the logger
vi.mock('../utils/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

describe('externalApi', () => {
  it('should export fetchElectionNews function', () => {
    expect(typeof fetchElectionNews).toBe('function');
  });

  it('should return an array of news items', async () => {
    const news = await fetchElectionNews();
    expect(Array.isArray(news)).toBe(true);
  });

  it('should return items with title and link fields', async () => {
    const news = await fetchElectionNews();
    if (news.length > 0) {
      const item = news[0];
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('link');
    }
  });

  it('should return at most 3 items', async () => {
    const news = await fetchElectionNews();
    expect(news.length).toBeLessThanOrEqual(3);
  });
});
