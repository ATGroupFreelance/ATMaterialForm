import { test } from '@playwright/test';
import { byFieldId, runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'MultiForm';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 1800,
      interactionLimitMs: 500,
      interaction: async (page, runIndex) => { await byFieldId(page, 'Name').fill(`perf-${runIndex}`); }
    });
  });
});
