import { test } from '@playwright/test';
import { runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'CascadeComboBoxPlayground';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 3500,
      interactionLimitMs: 900,
      interaction: async (page, runIndex) => { const input=page.getByLabel('Type 2 Country_Country', { exact: true }); await input.click(); await page.getByRole('option', { name: 'UK', exact: true }).click(); }
    });
  });
});
