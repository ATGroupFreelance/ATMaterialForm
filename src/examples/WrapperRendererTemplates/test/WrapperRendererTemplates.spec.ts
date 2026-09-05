import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'WrapperRendererTemplates';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('renders built-in wrapper templates while preserving ordinary fields', async ({ page }) => {
    await expect(byFieldId(page, 'Text1')).toBeVisible();
    await expect(byFieldId(page, 'Text3')).toBeVisible();
    await expect(byFieldId(page, 'Text4')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Button' })).toBeVisible();
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
