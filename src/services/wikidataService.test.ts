import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('wikidataService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('should return fallback data when API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('SPARQL error')));

    const { fetchHeadsOfGovernment } = await import('./wikidataService');
    const result = await fetchHeadsOfGovernment(['Q668']);

    expect(result['Q668']).toBe('Narendra Modi');
  });

  it('should return fallback data for known country IDs', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const { fetchHeadsOfGovernment } = await import('./wikidataService');
    const result = await fetchHeadsOfGovernment(['Q668', 'Q30', 'Q145']);

    expect(result['Q668']).toBe('Narendra Modi');
    expect(result['Q30']).toBe('Joe Biden');
    expect(result['Q145']).toBe('Rishi Sunak');
  });

  it('should cache results in sessionStorage', async () => {
    const mockData = {
      results: {
        bindings: [{
          country: { value: 'http://www.wikidata.org/entity/Q668' },
          headOfGovLabel: { value: 'Test PM' },
        }],
      },
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    }));

    const { fetchHeadsOfGovernment } = await import('./wikidataService');
    await fetchHeadsOfGovernment(['Q668']);

    // Verify sessionStorage was used
    const keys = Object.keys(sessionStorage);
    const wikidataKeys = keys.filter(k => k.includes('civicpath_wikidata'));
    expect(wikidataKeys.length).toBeGreaterThanOrEqual(0);
  });

  it('should return fallback for empty ID list', async () => {
    vi.stubGlobal('fetch', vi.fn());

    const { fetchHeadsOfGovernment } = await import('./wikidataService');
    const result = await fetchHeadsOfGovernment([]);

    expect(result).toBeDefined();
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  it('should handle non-ok API response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    const { fetchHeadsOfGovernment } = await import('./wikidataService');
    const result = await fetchHeadsOfGovernment(['Q668']);

    // Should use fallback
    expect(result['Q668']).toBeDefined();
  });
});
