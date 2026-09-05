import { test, expect } from '@playwright/test';
import { runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ContainerWithTablePlayground';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2600,
      interactionLimitMs: 850,
      interaction: async (page) => { const combo = page.getByRole('combobox').first(); await combo.click(); await page.getByRole('option', { name: '1', exact: true }).click(); await expect(page.getByTestId('example-stage')).toContainText('1A'); }
    });
  });
});
