import { test } from '@playwright/test';
import { byFieldId, runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ComponentPlayground';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 3000,
      interactionLimitMs: 700,
      interaction: async (page, runIndex) => { await byFieldId(page, 'Textbox_Text').fill(`perf-${runIndex}`); }
    });
  });
});
