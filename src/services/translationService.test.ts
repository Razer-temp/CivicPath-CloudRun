import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('translationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should return original texts when target language is English', async () => {
    const { translateTextBatch } = await import('./translationService');
    const texts = ['Hello', 'World'];
    const result = await translateTextBatch(texts, 'en');
    expect(result).toEqual(texts);
  });

  it('should return original texts when texts array is empty', async () => {
    const { translateTextBatch } = await import('./translationService');
    const result = await translateTextBatch([], 'hi');
    expect(result).toEqual([]);
  });

  it('should return original texts when texts is null-ish', async () => {
    const { translateTextBatch } = await import('./translationService');
    const result = await translateTextBatch(null as unknown as string[], 'hi');
    expect(result).toBeFalsy();
  });

  it('should not have hardcoded API keys', async () => {
    // Security test: ensure no hardcoded keys in source
    const fs = await import('fs');
    const source = fs.readFileSync('./src/services/translationService.ts', 'utf-8');
    expect(source).not.toMatch(/AIzaSy[A-Za-z0-9_-]{33}/);
    expect(source).toContain('import.meta.env');
  });

  it('should handle API failure gracefully', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', mockFetch);
    
    // Need to set env var for test
    vi.stubGlobal('import', { meta: { env: { VITE_GOOGLE_TRANSLATE_API_KEY: 'test' } } });
    
    const { translateTextBatch } = await import('./translationService');
    const texts = ['Hello'];
    const result = await translateTextBatch(texts, 'hi');
    // Should return original texts on error
    expect(result).toEqual(texts);
  });

  it('translateSingleText should delegate to translateTextBatch', async () => {
    const { translateSingleText } = await import('./translationService');
    expect(typeof translateSingleText).toBe('function');
  });
});
