import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { LanguageSwitcher } from './LanguageSwitcher';

// Mock Language Context
vi.mock('../../lib/LanguageContext', () => ({
  useTranslation: () => ({
    language: 'en',
    setLanguage: vi.fn(),
  }),
}));

describe('LanguageSwitcher Component', () => {
  it('renders correctly', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should not have basic accessibility violations', async () => {
    const { container } = render(<LanguageSwitcher />);
    // Disable landmarks rule as it requires a specific page structure
    const results = await axe(container, {
      rules: {
        region: { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });
});
