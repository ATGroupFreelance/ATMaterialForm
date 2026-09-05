import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ConditionalRender';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('conditionally adds DatePicker and can reset its value through the form ref', async ({ page }) => {
    await expect(page.getByLabel('Date', { exact: true })).not.toBeVisible();
    await page.getByRole('button', { name: 'Show Date Picker' }).click();
    const date = page.getByLabel('Date', { exact: true });
    await expect(date).toBeVisible();
    await page.getByRole('button', { name: 'Set Date Picker Value' }).click();
    await expect(date).not.toHaveValue('');
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
