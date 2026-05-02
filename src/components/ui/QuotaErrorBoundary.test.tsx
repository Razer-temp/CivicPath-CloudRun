import { render, screen } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { QuotaErrorBoundary } from './QuotaErrorBoundary';

describe('QuotaErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <QuotaErrorBoundary>
        <div data-testid="child">Safe Content</div>
      </QuotaErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Safe Content')).toBeInTheDocument();
  });

  it('renders error UI when a child throws a quota error', () => {
    const ThrowError = () => {
      throw new Error('quota exceeded');
    };

    // Suppress console.error for expected errors
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <QuotaErrorBoundary>
        <ThrowError />
      </QuotaErrorBoundary>
    );

    expect(screen.getByText('System Taking a Break')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('shows rate limit message for 429 errors', () => {
    const ThrowRateLimit = () => {
      throw new Error('429 Too Many Requests');
    };

    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <QuotaErrorBoundary>
        <ThrowRateLimit />
      </QuotaErrorBoundary>
    );

    expect(screen.getByText('High Traffic Alert')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const ThrowError = () => {
      throw new Error('test error');
    };

    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <QuotaErrorBoundary fallback={<div>Custom Fallback</div>}>
        <ThrowError />
      </QuotaErrorBoundary>
    );

    expect(screen.getByText('Custom Fallback')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('should not have basic accessibility violations', async () => {
    const { container } = render(
      <QuotaErrorBoundary>
        <div>Accessible Content</div>
      </QuotaErrorBoundary>
    );
    const results = await axe(container, {
      rules: { region: { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});
