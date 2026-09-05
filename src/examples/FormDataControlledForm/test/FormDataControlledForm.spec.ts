import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'FormDataControlledForm';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('accepts controlled FormData updates including nested form data', async ({ page }) => {
    await page.getByRole('button', { name: 'setValue', exact: true }).click();
    await expect(byFieldId(page, 'TextBox1')).toHaveValue("I'm set Value");
    await page.getByRole('button', { name: 'setValue SecondaryForm' }).click();
    await expect(byFieldId(page, 'TextBox2')).toHaveValue("I'm set Value");
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
