import { test, expect } from '@playwright/test';
import { expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ControlledForm';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('external controlled value updates the form and later user changes emit the controlled value', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: 'CheckBox' });
    await expect(checkbox).not.toBeChecked();

    await page.getByRole('button', { name: 'Form Set Value', exact: true }).click();
    await expect(checkbox).toBeChecked();

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
    await expectFormOutput(page, { CheckBox: false });
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
