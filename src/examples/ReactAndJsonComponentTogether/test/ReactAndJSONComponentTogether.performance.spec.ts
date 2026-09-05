import { test } from '@playwright/test';
import { runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ReactAndJSONComponentTogether';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2200,
      interactionLimitMs: 600,
      interaction: async (page, runIndex) => { await page.getByLabel('This is from React Component', { exact: true }).fill(`perf-${runIndex}`); }
    });
  });
});
