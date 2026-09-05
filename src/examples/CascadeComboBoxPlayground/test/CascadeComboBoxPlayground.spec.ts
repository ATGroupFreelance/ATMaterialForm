import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'CascadeComboBoxPlayground';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('filters strict-format child cascade options from the selected parent', async ({ page }) => {
    const country = page.getByLabel('Type 2 Country_Country', { exact: true });
    await country.click();
    await page.getByRole('option', { name: 'UK', exact: true }).click();
    const state = page.getByLabel('Type 2 Country_State', { exact: true });
    await state.click();
    await expect(page.getByRole('option', { name: 'England', exact: true })).toBeVisible();
    await page.getByRole('option', { name: 'England', exact: true }).click();
    const capital = page.getByLabel('Type 2 Country_Capital', { exact: true });
    await capital.click();
    await expect(page.getByRole('option', { name: 'EnglandCapital', exact: true })).toBeVisible();
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
