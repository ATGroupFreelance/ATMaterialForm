import { test } from '@playwright/test';
import { byFieldId, runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'BasicForm';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 3200,
      interactionLimitMs: 800,
      interaction: async (page, runIndex) => { await byFieldId(page, 'A').fill(String(runIndex + 10)); }
    });
  });
});
