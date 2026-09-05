import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ToastPlayground';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('fires toast notifications and confirmation flow', async ({ page }) => {
    await page.getByRole('button', { name: 'Simple Notifiation' }).click();
    await expect(page.getByText('This is a simple notification', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Show Are you sure!' }).click();
    await expect(page.getByText('Are you sure?', { exact: true })).toBeVisible();
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
