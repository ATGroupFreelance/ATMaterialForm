import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'WrapMultipleElements';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('renders nested forms through collapse/grid wrappers without losing sibling fields', async ({ page }) => {
    await expect(byFieldId(page, 'TextBox3')).toBeVisible();
    await expect(byFieldId(page, 'TextBox4')).toBeVisible();
    await expect(page.getByTestId('example-stage').locator('[id="TextBox1"]')).toHaveCount(3);
    await expect(page.getByTestId('example-stage').locator('[id="TextBox2"]')).toHaveCount(3);
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
