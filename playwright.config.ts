import { defineConfig, devices } from '@playwright/test';

// Smoke suite for what jsdom can't check: real layout (overflow), the header and menus, the
// projects dialog and an axe scan. Runs against the built site: `npm run build` first.
const PORT = 4173;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `node scripts/serve-out.js ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  // channel 'chromium' runs full Chromium in new headless mode (closer to real Chrome), so only
  // `npx playwright install --no-shell chromium` is needed. Pixel 7 is Chromium too.
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chromium' } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chromium' } },
  ],
});
