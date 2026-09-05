import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'FormDialog';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('opens a real form dialog and renders its form field', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Dialog' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('Form Dialog title');
    await expect(dialog.locator('[id="formDialogTextBox"]')).toBeVisible();
    await dialog.locator('[id="formDialogTextBox"]').fill('dialog value');
    await expect(dialog.locator('[id="formDialogTextBox"]')).toHaveValue('dialog value');
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
