import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'TabsInForm';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('switches visible form fields when the form tab changes', async ({ page }) => {
    await expect(byFieldId(page, 'imInTab1')).toBeVisible();
    await expect(byFieldId(page, 'imInTab2')).not.toBeVisible();
    await page.getByRole('tab', { name: 'Tab Title 2' }).click();
    await expect(byFieldId(page, 'imInTab2')).toBeVisible();
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
