import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'HowToUseContainerWithTable';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('adds container form data to its table and keeps outside fields separate', async ({ page }) => {
    await byFieldId(page, 'OutsideContainer_TextBox1').fill('outside');
    await byFieldId(page, 'Name').fill('Alice');
    await byFieldId(page, 'A').fill('2');
    await byFieldId(page, 'B').fill('3');
    await expect(byFieldId(page, 'C')).toHaveValue('23');
    await page.getByRole('button', { name: /Local text Add|Add/ }).click();
    await expect(page.getByTestId('example-stage')).toContainText('Alice');
    await expectFormOutput(page, { OutsideContainer_TextBox1: 'outside' });
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
