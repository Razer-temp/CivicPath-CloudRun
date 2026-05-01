import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('weatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return weather data on successful fetch', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        daily: {
          temperature_2m_max: [32.5],
          temperature_2m_min: [24.0],
          weathercode: [0],
        },
      }),
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    const { fetchHistoricalWeather } = await import('./weatherService');
    const result = await fetchHistoricalWeather(28.6, 77.2, new Date());

    expect(result.maxTemp).toBe(32.5);
    expect(result.minTemp).toBe(24.0);
    expect(result.description).toBe('Clear & Sunny');
    expect(result.type).toBe('sunny');
  });

  it('should return cloudy for weather code > 3', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        daily: {
          temperature_2m_max: [28.0],
          temperature_2m_min: [20.0],
          weathercode: [4],
        },
      }),
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    const { fetchHistoricalWeather } = await import('./weatherService');
    const result = await fetchHistoricalWeather(28.6, 77.2, new Date());

    expect(result.description).toBe('Partly Cloudy');
    expect(result.type).toBe('cloudy');
  });

  it('should return rain for weather code > 50', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        daily: {
          temperature_2m_max: [25.0],
          temperature_2m_min: [18.0],
          weathercode: [61],
        },
      }),
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    const { fetchHistoricalWeather } = await import('./weatherService');
    const result = await fetchHistoricalWeather(28.6, 77.2, new Date());

    expect(result.description).toBe('Rain Expected');
    expect(result.type).toBe('rain');
  });

  it('should return fallback on fetch failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network Error')));

    const { fetchHistoricalWeather } = await import('./weatherService');
    const result = await fetchHistoricalWeather(28.6, 77.2, new Date());

    expect(result.maxTemp).toBe(34.5);
    expect(result.minTemp).toBe(24.2);
    expect(result.type).toBe('cloudy');
  });

  it('should return fallback on non-ok response', async () => {
    const mockResponse = { ok: false };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    const { fetchHistoricalWeather } = await import('./weatherService');
    const result = await fetchHistoricalWeather(28.6, 77.2, new Date());

    // Should fallback
    expect(result).toBeDefined();
    expect(result.maxTemp).toBeDefined();
  });
});
