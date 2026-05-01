import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cmsService } from './cmsService';

describe('cmsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return India fallback content for "in" country code', async () => {
    const result = await cmsService.getFallback('in', 'step1_election');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(10);
  });

  it('should return US fallback content for "us" country code', async () => {
    const result = await cmsService.getFallback('us', 'step1_election');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should return UK fallback content for "gb" country code', async () => {
    const result = await cmsService.getFallback('gb', 'step1_election');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should return Brazil fallback for "br" country code', async () => {
    const result = await cmsService.getFallback('br', 'step1_election');
    expect(result).toBeTruthy();
  });

  it('should return Canada fallback for "ca" country code', async () => {
    const result = await cmsService.getFallback('ca', 'step1_election');
    expect(result).toBeTruthy();
  });

  it('should return Australia fallback for "au" country code', async () => {
    const result = await cmsService.getFallback('au', 'step1_election');
    expect(result).toBeTruthy();
  });

  it('should return generic fallback for unsupported country', async () => {
    const result = await cmsService.getFallback('zz', 'step1_election');
    expect(result).toContain('Overview of Elections');
    expect(result).toContain('ZZ');
  });

  it('should handle all 5 step types in generic fallback', async () => {
    const steps = ['step1_election', 'step2_registration', 'step3_candidates', 'step4_votingday', 'step5_results'];
    for (const step of steps) {
      const result = await cmsService.getFallback('zz', step);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    }
  });

  it('should return default message for unknown step type', async () => {
    const result = await cmsService.getFallback('zz', 'unknown_step');
    expect(result).toBe('Check your local election guidelines for more details.');
  });
});
