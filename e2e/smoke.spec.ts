import { test, expect } from '@playwright/test';

/**
 * Skeleton smoke test confirming the Playwright harness itself is wired up.
 * Real flow tests (guest search -> booking -> payment -> check-in) will be added per-module as
 * each backend module reaches Gate 4 (E2E Flow Test) in the factory loop.
 */
test('home page loads and renders the hero section', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);
});

for (const path of ['/login', '/register', '/terms', '/privacy']) {
  test(`${path} renders without client errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('property entry points go directly to the portal', async ({ page }) => {
  await page.goto('/');
  const propertyLink = page.getByRole('link', { name: /List your property/ }).first();
  await expect(propertyLink).toHaveAttribute('href', /https?:\/\/[^\s]+\/list-property/);
});

test('protected routes preserve the destination through login', async ({ request }) => {
  const response = await request.get('/payment?bookingId=test', { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  const location = new URL(response.headers().location, response.url());
  expect(location.pathname).toBe('/login');
  expect(location.searchParams.get('redirect')).toBe('/payment?bookingId=test');
});

test('legacy owner routes redirect to the portal', async ({ request }) => {
  for (const path of ['/owner', '/owner/onboarding/basics', '/owner-auth']) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(new URL(response.headers().location).pathname).toBe('/list-property');
  }
});
