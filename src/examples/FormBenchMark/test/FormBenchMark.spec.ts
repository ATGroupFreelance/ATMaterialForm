import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'FormBenchMark';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('benchmark controls actually rebuild the measured simple form size', async ({ page }) => {
    const fields = page.getByLabel('NUM_FIELDS (simple):');
    await fields.fill('20');
    await expect(byFieldId(page, 'field19')).toBeVisible();
    await expect(byFieldId(page, 'field20')).toHaveCount(0);
    await page.getByRole('button', { name: 'Simple: Reset' }).click();
    await expect(page.getByText('Simple form results')).toBeVisible();
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
