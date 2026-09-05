import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'HowToUseRuntime';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('runtime initialization applies default values and responds to runtime-definition changes', async ({ page }) => {
    const name = byFieldId(page, 'Name').first();
    await expect(name).toHaveValue('1');
    await page.getByRole('button', { name: 'Change runtime val' }).click();
    await expect(name).toHaveValue('2');
    await expect(page.getByText('report test', { exact: true })).toBeVisible();
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
