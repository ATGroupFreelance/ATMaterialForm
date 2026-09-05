import { test, expect } from '@playwright/test';
import { runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ConditionalRender';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2200,
      interactionLimitMs: 650,
      interaction: async (page) => { await page.getByRole('button', { name: 'Show Date Picker', exact: true }).click(); await expect(page.getByLabel('Date', { exact: true })).toBeVisible(); }
    });
  });
});
