import { test } from '@playwright/test';
import { byFieldId, runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'HowToUseContainerWithTable';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 3300,
      interactionLimitMs: 900,
      interaction: async (page, runIndex) => { await byFieldId(page, 'Name').fill(`row-${runIndex}`); }
    });
  });
});
