import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';

// Mock auth context
vi.mock('../../lib/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}));

// Mock language context
vi.mock('../../lib/LanguageContext', () => ({
  useTranslation: () => ({
    t: (text: string) => text,
    language: 'en',
    setLanguage: vi.fn(),
  }),
}));

import { ProtectedRoute } from '../auth/ProtectedRoute';

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    // When user is null, ProtectedRoute renders Navigate to /login
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

describe('Layout Accessibility', () => {
  it('Layout has semantic main element and skip link', async () => {
    // Dynamically import to avoid circular deps
    const { Layout } = await import('./Layout');
    
    const { container } = render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    // Check for skip-to-content link
    const skipLink = container.querySelector('a[href="#main-content"]');
    expect(skipLink).toBeTruthy();
    expect(skipLink?.textContent).toContain('Skip to main content');

    // Check for semantic main element
    const mainElement = container.querySelector('main#main-content');
    expect(mainElement).toBeTruthy();
  });

  it('should not have critical accessibility violations', async () => {
    const { Layout } = await import('./Layout');
    
    const { container } = render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    const results = await axe(container, {
      rules: {
        region: { enabled: false },
        'landmark-one-main': { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });
});
