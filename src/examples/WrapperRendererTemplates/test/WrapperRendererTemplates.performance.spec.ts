import { test } from '@playwright/test';
import { byFieldId, runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'WrapperRendererTemplates';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2200,
      interactionLimitMs: 600,
      interaction: async (page, runIndex) => { await byFieldId(page, 'Text3').fill(`perf-${runIndex}`); }
    });
  });
});
