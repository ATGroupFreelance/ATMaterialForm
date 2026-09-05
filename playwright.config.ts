import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const externalBaseURL = process.env.AT_TEST_BASE_URL?.trim();
const baseURL = externalBaseURL || 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: './src',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 35_000,
  updateSnapshots: process.env.CI ? 'none' : 'missing',

  expect: {
    timeout: 7_500,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.012,
      stylePath: path.resolve('src/testing/playwright/visual-regression.css'),
    },
  },

  snapshotPathTemplate: '{testDir}/{testFileDir}/screenshots/{arg}{ext}',

  reporter: process.env.CI
    ? [['line'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : [['line']],

  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    viewport: {
      width: 1440,
      height: 1000,
    },
    colorScheme: 'light',
    locale: 'en-US',
    timezoneId: 'UTC',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },

  webServer: externalBaseURL
    ? undefined
    : {
        command: 'npm run start:test',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stdout: 'pipe',
        stderr: 'pipe',
      },

  projects: [
    {
      name: 'regression',
      testMatch: [
        '**/examples/**/test/*.spec.ts',
        '**/beta/**/test/*.spec.ts',
      ],
      testIgnore: '**/*.performance.spec.ts',
    },
    {
      name: 'performance',
      testMatch: [
        '**/examples/**/test/*.performance.spec.ts',
        '**/beta/**/test/*.performance.spec.ts',
      ],
    },
  ],
});
