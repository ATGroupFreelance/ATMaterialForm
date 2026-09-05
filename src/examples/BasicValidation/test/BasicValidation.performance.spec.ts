import { test, expect } from '@playwright/test';
import { runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'BasicValidation';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 1800,
      interactionLimitMs: 650,
      interaction: async (page) => {
        await page.getByRole('button', { name: 'Submit', exact: true }).click();
        await expect(
          page.getByText('Custom (This field can not be empty)', { exact: true }),
        ).toBeVisible();
      },
    });
  });
});
