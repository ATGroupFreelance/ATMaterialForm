import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'FormDataSemiKeyValueControlledForm';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('accepts an external controlled value and emits the next real user edit', async ({ page }) => {
    const input = byFieldId(page, 'TextBox1');

    await page.getByRole('button', { name: 'setValue', exact: true }).click();
    await expect(input).toHaveValue("I'm set Value");

    await input.fill('Changed by user');
    await expectFormOutput(page, { TextBox1: 'Changed by user' });
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
