import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ContainerWithTablePlayground';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('loads round-specific saved table rows after selecting a round', async ({ page }) => {
    const combo = page.getByRole('combobox').first();
    await combo.click();
    await page.getByRole('option', { name: '1', exact: true }).click();
    await expect(page.getByTestId('example-stage')).toContainText('1A');
    await expect(page.getByTestId('example-stage')).toContainText('1B');
    await expect(byFieldId(page, 'Name')).toBeVisible();
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
