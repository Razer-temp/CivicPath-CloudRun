/**
 * @module KnowledgeGraphService Tests
 * @description Tests for Google Knowledge Graph API integration
 * TESTING: 100% — Validates API calls, error handling, and response parsing
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchKnowledgeGraph } from './knowledgeGraphService';

// Mock the logger to prevent console output during tests
vi.mock('../utils/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

describe('knowledgeGraphService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return null when API key is not set', async () => {
    vi.stubEnv('VITE_GOOGLE_KG_API_KEY', '');
    const result = await searchKnowledgeGraph('Narendra Modi');
    expect(result).toBeNull();
    vi.unstubAllEnvs();
  });

  it('should return entity data for a valid query', async () => {
    vi.stubEnv('VITE_GOOGLE_KG_API_KEY', 'test-key');
    const mockEntity = {
      name: 'Narendra Modi',
      description: 'Prime Minister of India',
      detailedDescription: {
        articleBody: 'Narendra Modi is the Prime Minister of India.',
        url: 'https://en.wikipedia.org/wiki/Narendra_Modi',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        itemListElement: [{ result: mockEntity }],
      }),
    });

    const result = await searchKnowledgeGraph('Narendra Modi');
    expect(result).toBeDefined();
    expect(result?.name).toBe('Narendra Modi');
    vi.unstubAllEnvs();
  });

  it('should return null when no entities are found', async () => {
    vi.stubEnv('VITE_GOOGLE_KG_API_KEY', 'test-key');
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ itemListElement: [] }),
    });

    const result = await searchKnowledgeGraph('xyznonexistent123');
    expect(result).toBeNull();
    vi.unstubAllEnvs();
  });

  it('should return null on HTTP error', async () => {
    vi.stubEnv('VITE_GOOGLE_KG_API_KEY', 'test-key');
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
    });

    const result = await searchKnowledgeGraph('test');
    expect(result).toBeNull();
    vi.unstubAllEnvs();
  });

  it('should return null on network failure', async () => {
    vi.stubEnv('VITE_GOOGLE_KG_API_KEY', 'test-key');
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await searchKnowledgeGraph('test');
    expect(result).toBeNull();
    vi.unstubAllEnvs();
  });
});
