import { test, expect } from '@playwright/test';
import { runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ConditionalRendering';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2100,
      interactionLimitMs: 600,
      interaction: async (page) => { await page.getByRole('button', { name: 'Toggle Condition', exact: true }).click(); await expect(page.getByLabel('Date', { exact: true })).toBeVisible(); }
    });
  });
});
