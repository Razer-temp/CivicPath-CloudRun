import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { localCache } from './cacheService';
import { get, set } from 'idb-keyval';

vi.mock('idb-keyval', () => ({
  get: vi.fn(),
  set: vi.fn()
}));

const mockedGet = vi.mocked(get);
const mockedSet = vi.mocked(set);

describe('localCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should return undefined for a cache miss', async () => {
    mockedGet.mockResolvedValueOnce(undefined);
    const result = await localCache.get('nonexistent');
    expect(result).toBeUndefined();
    expect(mockedGet).toHaveBeenCalledWith('nonexistent');
  });

  it('should return cache entry if within TTL', async () => {
    const entry = { text: 'Hello', timestamp: Date.now(), modelVersion: 'gemini-1.5-flash' };
    mockedGet.mockResolvedValueOnce(entry);

    const result = await localCache.get('existent');
    expect(result).toEqual(entry);
  });

  it('should return undefined if cache is older than TTL', async () => {
    const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
    const entry = { text: 'Old data', timestamp: Date.now() - CACHE_TTL_MS - 1000, modelVersion: 'gemini-1.5-flash' };
    mockedGet.mockResolvedValueOnce(entry);

    const result = await localCache.get('expired');
    expect(result).toBeUndefined();
  });

  it('should save data into indexedDB', async () => {
    const entry = {
      cacheKey: 'key',
      country: 'us',
      persona: 'default',
      step: '1',
      content: 'new data',
      timestamp: Date.now(),
      modelVersion: 'gemini-1.5-flash'
    };
    await localCache.save(entry);
    expect(mockedSet).toHaveBeenCalledWith('key', expect.objectContaining({
      content: 'new data',
      modelVersion: 'gemini-1.5-flash'
    }));
  });
});
