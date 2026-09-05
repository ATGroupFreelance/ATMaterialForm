import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'FormInForm';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('renders nested FormA fields and reveals tab-bound FormB fields', async ({ page }) => {
    await expect(byFieldId(page, 'A1')).toBeVisible();
    await expect(byFieldId(page, 'B1')).not.toBeVisible();
    await page.getByRole('tab', { name: 'FormB' }).click();
    await expect(byFieldId(page, 'B1')).toBeVisible();
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
