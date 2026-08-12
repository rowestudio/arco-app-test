import { defineConfig } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4173';
const diagnosticWithoutArtifacts = process.env.E8X_DIAG_NO_ARTIFACTS === '1';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],
  use: {
    baseURL,
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    screenshot: diagnosticWithoutArtifacts ? 'off' : 'only-on-failure',
    trace: diagnosticWithoutArtifacts ? 'off' : 'retain-on-failure',
    video: diagnosticWithoutArtifacts ? 'off' : 'retain-on-failure',
  },
  projects: [
    {
      name: 'webkit-mobile-smoke',
      use: { browserName: 'webkit' },
    },
  ],
  webServer: {
    command: 'node scripts/test/serve-static.mjs',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
