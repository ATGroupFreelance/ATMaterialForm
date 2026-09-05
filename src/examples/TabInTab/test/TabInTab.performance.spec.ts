import { test } from '@playwright/test';
import { runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'TabInTab';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2600,
      interactionLimitMs: 700,
      interaction: async (page, runIndex) => { await page.getByRole('tab', { name: 'tab1', exact: true }).click(); }
    });
  });
});
