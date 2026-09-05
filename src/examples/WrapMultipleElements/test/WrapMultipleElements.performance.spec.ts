import { test } from '@playwright/test';
import { byFieldId, runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'WrapMultipleElements';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2400,
      interactionLimitMs: 650,
      interaction: async (page, runIndex) => { await byFieldId(page, 'TextBox3').fill(`perf-${runIndex}`); }
    });
  });
});
