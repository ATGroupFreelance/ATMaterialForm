import { test } from '@playwright/test';
import { runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ToastPlayground';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2200,
      interactionLimitMs: 600,
      interaction: async (page, runIndex) => { await page.getByRole('button', { name: 'Simple Notifiation' }).click(); }
    });
  });
});
