import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'TabInTab';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('supports nested tab paths and changes the visible tab-bound field', async ({ page }) => {
    await expect(byFieldId(page, 'NoTab_0')).toBeVisible();
    await page.getByRole('tab', { name: 'tab1', exact: true }).click();
    await expect(byFieldId(page, 'Tab_1')).toBeVisible();
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
