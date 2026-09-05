import { test, expect } from '@playwright/test';
import { byFieldId, runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'TabsInForm';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 1900,
      interactionLimitMs: 500,
      interaction: async (page) => { await page.getByRole('tab', { name: 'Tab Title 2', exact: true }).click(); await expect(byFieldId(page, 'imInTab2')).toBeVisible(); }
    });
  });
});
