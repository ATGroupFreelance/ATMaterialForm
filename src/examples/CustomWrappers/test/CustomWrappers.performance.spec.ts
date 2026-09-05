import { test } from '@playwright/test';
import { byFieldId, runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'CustomWrappers';

test.describe(EXAMPLE, () => {
  test('performance regression', async ({ page }, testInfo) => {
    await runPerformanceRegression(page, testInfo, EXAMPLE, {
      renderLimitMs: 2200,
      interactionLimitMs: 650,
      interaction: async (page, runIndex) => { await byFieldId(page, 'TextBoxWithWrapperA').fill(String(runIndex)); }
    });
  });
});
