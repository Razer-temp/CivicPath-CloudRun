import { test, expect } from '@playwright/test';

test.describe('CivicPath Core Navigation', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CivicPath/);
  });

  test('hero section is visible on homepage', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('main navigation is present', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation');
    await expect(nav.first()).toBeVisible();
  });

  test('skip-to-content link exists and is accessible', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveCount(1);
  });

  test('logo links to home page', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('a[aria-label="CivicPath Home"]');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '/');
  });
});

test.describe('CivicPath Public Pages', () => {
  test('countries page loads', async ({ page }) => {
    await page.goto('/countries');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('learn page loads', async ({ page }) => {
    await page.goto('/learn');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('compare page loads', async ({ page }) => {
    await page.goto('/compare');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('timeline page loads', async ({ page }) => {
    await page.goto('/timeline');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('map page loads', async ({ page }) => {
    await page.goto('/map');
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('CivicPath Auth Flow', () => {
  test('login page loads with sign-in form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('CivicPath');
    await expect(page.locator('#email-input')).toBeVisible();
    await expect(page.locator('#password-input')).toBeVisible();
  });

  test('protected routes redirect to login', async ({ page }) => {
    await page.goto('/assistant');
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test('profile route redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('CivicPath Accessibility', () => {
  test('page has semantic HTML structure', async ({ page }) => {
    await page.goto('/');
    const mainContent = page.locator('main#main-content');
    await expect(mainContent).toBeVisible();
    
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});
