import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'UserManager';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('renders initial row and opens the add-record form dialog', async ({ page }) => {
    const stage = page.getByTestId('example-stage');
    await expect(stage).toContainText('20');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').locator('[id="A"]')).toBeVisible();
    await expect(page.getByRole('dialog').locator('[id="B"]')).toBeVisible();
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
