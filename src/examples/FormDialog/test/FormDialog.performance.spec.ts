import { test, expect } from '@playwright/test';
import { runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'FormDialog';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2200,
      interactionLimitMs: 700,
      interaction: async (page, runIndex) => { await page.getByRole('button', { name: 'Open Dialog' }).click(); await expect(page.getByRole('dialog')).toBeVisible(); }
    });
  });
});
