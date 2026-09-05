import { test, expect } from '@playwright/test';
import { runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'CardSelectPlayground';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2200,
      interactionLimitMs: 550,
      interaction: async (page) => {
        const card = page.getByRole('radio', { name: 'Dark Fiber', exact: true });
        await card.click();
        await expect(card).toHaveAttribute('aria-checked', 'true');
      },
    });
  });
});
