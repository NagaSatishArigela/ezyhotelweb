import { defineConfig, devices } from '@playwright/test';

/**
 * E2E flow-test skeleton for the M0-M6 module factory loop (Gate 4: E2E Flow
 * Test). Specs live in `e2e/` and exercise the full guest/owner flows against
 * a running Next.js app + quicknestserver API.
 *
 * Local usage:
 *   npm run dev               (terminal 1: Next.js on :3000)
 *   cd ../quicknestserver && npm run start:dev   (terminal 2: API on :4000)
 *   npm run test:e2e           (terminal 3)
 *
 * `webServer` below can auto-start the Next.js dev server for CI; the API
 * server is started separately (see quicknestserver test:e2e for backend
 * integration tests).
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
