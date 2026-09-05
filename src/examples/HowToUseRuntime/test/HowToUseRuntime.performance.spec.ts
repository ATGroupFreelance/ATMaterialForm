import { test, expect } from '@playwright/test';
import { byFieldId, runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'HowToUseRuntime';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 3600,
      interactionLimitMs: 900,
      interaction: async (page) => { await page.getByRole('button', { name: 'Change runtime val', exact: true }).click(); await expect(byFieldId(page, 'Name').first()).toHaveValue('2'); }
    });
  });
});
