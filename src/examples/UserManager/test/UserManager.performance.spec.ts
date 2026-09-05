import { test, expect } from '@playwright/test';
import { runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'UserManager';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2800,
      interactionLimitMs: 900,
      interaction: async (page, runIndex) => { await page.getByRole('button', { name: 'Add', exact: true }).click(); await expect(page.getByRole('dialog')).toBeVisible(); }
    });
  });
});
