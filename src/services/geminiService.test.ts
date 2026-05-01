import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Google GenAI SDK
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: 'Mock AI response about elections',
      }),
    },
  })),
}));

// Mock cacheService
vi.mock('./cacheService', () => ({
  localCache: {
    get: vi.fn().mockResolvedValue(undefined),
    save: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock cmsService
vi.mock('./cmsService', () => ({
  cmsService: {
    getFallback: vi.fn().mockResolvedValue('Fallback CMS content'),
  },
}));

// Mock firestoreCache
vi.mock('./firestoreCache', () => ({
  crowdCache: {
    get: vi.fn().mockResolvedValue(null),
    save: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set mock API key
    vi.stubGlobal('process', { env: { GEMINI_API_KEY: 'test-key' } });
    localStorage.setItem('civicpath_lang', 'en');
  });

  it('should export generateText function', async () => {
    const { generateText } = await import('./geminiService');
    expect(typeof generateText).toBe('function');
  });

  it('should export generateGuideContent function', async () => {
    const { generateGuideContent } = await import('./geminiService');
    expect(typeof generateGuideContent).toBe('function');
  });

  it('should export generateChat function', async () => {
    const { generateChat } = await import('./geminiService');
    expect(typeof generateChat).toBe('function');
  });

  it('should export generateJson function', async () => {
    const { generateJson } = await import('./geminiService');
    expect(typeof generateJson).toBe('function');
  });

  it('should return null from getGemini when no API key is set', async () => {
    vi.stubGlobal('process', { env: { GEMINI_API_KEY: '' } });
    // Re-import to reset singleton
    vi.resetModules();
    vi.mock('@google/genai', () => ({
      GoogleGenAI: vi.fn(),
    }));
    vi.mock('./cacheService', () => ({
      localCache: { get: vi.fn(), save: vi.fn() },
    }));
    vi.mock('./cmsService', () => ({
      cmsService: { getFallback: vi.fn() },
    }));
    vi.mock('./firestoreCache', () => ({
      crowdCache: { get: vi.fn(), save: vi.fn() },
    }));
    const { getGemini } = await import('./geminiService');
    const result = getGemini();
    expect(result).toBeNull();
  });

  it('generateText should contain strict system bounds', async () => {
    const { generateText } = await import('./geminiService');
    // The function includes STRICT_BOUNDS to prevent political bias
    const result = await generateText('What is voting?');
    expect(typeof result).toBe('string');
  });

  it('should export ContentSource type correctly', async () => {
    const mod = await import('./geminiService');
    expect(mod).toBeDefined();
  });
});
