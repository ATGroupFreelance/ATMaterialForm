import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'CustomWrappers';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('custom wrapper receives child behavior and reflects numeric validation state', async ({ page }) => {
    const input = byFieldId(page, 'TextBoxWithWrapperA');
    await input.fill('123');
    await expect(input.locator('xpath=ancestor::div[contains(@style,"dotted")][1]')).toContainText('true');
    await input.fill('abc');
    await expect(input.locator('xpath=ancestor::div[contains(@style,"dotted")][1]')).toContainText('false');
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
