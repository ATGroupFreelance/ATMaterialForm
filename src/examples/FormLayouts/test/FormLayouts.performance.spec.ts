import { test } from '@playwright/test';
import { byFieldId, runPerformanceRegression } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'FormLayouts';

test.describe(EXAMPLE, () => {
    test('performance regression', async ({ page }, testInfo) => {
        await runPerformanceRegression(page, testInfo, EXAMPLE, {
            renderLimitMs: 2600,
            interactionLimitMs: 700,
            interaction: async (page, runIndex) => {
                await byFieldId(page, 'FirstName').fill(`layout-${runIndex}`);
            },
        });
    });
});
