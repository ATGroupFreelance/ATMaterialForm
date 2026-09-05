import { test, expect } from '@playwright/test';
import { runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ControlledForm';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 1900,
      interactionLimitMs: 550,
      interaction: async (page) => { await page.getByRole('button', { name: 'Form Set Value', exact: true }).click(); await expect(page.getByRole('checkbox', { name: 'CheckBox' })).toBeChecked(); }
    });
  });
});
