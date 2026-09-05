import { test, expect } from '@playwright/test';
import { byFieldId, runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'FormDataSemiKeyValueControlledForm';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2000,
      interactionLimitMs: 550,
      interaction: async (page) => { await page.getByRole('button', { name: 'setValue', exact: true }).click(); await expect(byFieldId(page, 'TextBox1')).toHaveValue("I'm set Value"); }
    });
  });
});
