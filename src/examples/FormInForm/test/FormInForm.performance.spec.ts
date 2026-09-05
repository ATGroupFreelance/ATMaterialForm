import { test, expect } from '@playwright/test';
import { byFieldId, runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'FormInForm';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2400,
      interactionLimitMs: 600,
      interaction: async (page) => { await page.getByRole('tab', { name: 'FormB', exact: true }).click(); await expect(byFieldId(page, 'B1')).toBeVisible(); }
    });
  });
});
