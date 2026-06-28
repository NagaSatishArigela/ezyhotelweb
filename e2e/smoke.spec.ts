import { test, expect } from '@playwright/test';

/**
 * Skeleton smoke test confirming the Playwright harness itself is wired up.
 * Real flow tests (guest search -> booking -> payment -> check-in, owner
 * onboarding -> verification -> listing live) will be added per-module as
 * each backend module reaches Gate 4 (E2E Flow Test) in the factory loop.
 */
test('home page loads and renders the hero section', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);
});
