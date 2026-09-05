import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ConditionalRendering';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('inserts and removes the conditional Date field while preserving configured defaults', async ({ page }) => {
    await expect(byFieldId(page, 'Name')).toHaveValue('Test');
    await expect(page.getByLabel('Date', { exact: true })).not.toBeVisible();
    await page.getByRole('button', { name: 'Toggle Condition' }).click();
    await expect(page.getByLabel('Date', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Toggle Condition' }).click();
    await expect(page.getByLabel('Date', { exact: true })).not.toBeVisible();
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
