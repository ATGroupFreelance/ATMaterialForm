import { test, expect } from '@playwright/test';
import { runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'Playground';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 1800,
      interactionLimitMs: 450,
      interaction: async (page) => { await page.getByRole('button', { name: 'Playground', exact: true }).click(); await expect(page.getByTestId('example-stage')).toContainText('2'); }
    });
  });
});
