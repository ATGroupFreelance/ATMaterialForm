import { test } from '@playwright/test';
import { byFieldId, runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'FormBenchMark';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 6500,
      interactionLimitMs: 1200,
      interaction: async (page, runIndex) => { await byFieldId(page, 'field0').fill(`perf-${runIndex}`); }
    });
  });
});
