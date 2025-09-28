import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  reporter: [
    ['dot'],
    ['list'],
    ['json', { outputFile: 'playwright-report/json/report.json' }],
    ['html', { outputFolder: 'playwright-report/html', open: 'never' }],
  ],

  use: {
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: null, // Full-screen
    launchOptions: {
      args: ['--start-maximized'], // Open browser maximized
      slowMo: 200, // slows down each action by 200ms

    },
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: null,             // Full-screen
        ignoreHTTPSErrors: true,
        launchOptions: {
          args: ['--start-maximized'], // Open maximized
        },
      },
    },
  ],
});
