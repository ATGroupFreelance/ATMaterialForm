import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'Table';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('renders the configured table label and row values', async ({ page }) => {
    const table = page.getByRole('table', { name: 'Documents' });
    await expect(table).toBeVisible();
    await expect(table).toContainText('10');
    await expect(table).toContainText('2000');
    await expect(table).toContainText('5000');
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
