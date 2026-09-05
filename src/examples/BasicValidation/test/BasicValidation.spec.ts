import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'BasicValidation';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('required field reports validation feedback when the form validation API runs', async ({ page }) => {
    const input = byFieldId(page, 'Name');
    await input.fill('valid');
    await input.fill('');

    await page.getByRole('button', { name: 'Submit', exact: true }).click();

    await expect(
      page.getByText('Custom (This field can not be empty)', { exact: true }),
    ).toBeVisible();
  });

  test('valid value can be submitted without required-field feedback', async ({ page }) => {
    await byFieldId(page, 'Name').fill('Ada');
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(
      page.getByText('Custom (This field can not be empty)', { exact: true }),
    ).toHaveCount(0);
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
