import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ComponentPlayground';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('renders file viewer defaults alongside editable fields', async ({ page }) => {
    await expect(byFieldId(page, 'Textbox_Text')).toBeVisible();
    const stage = page.getByTestId('example-stage');
    await expect(stage).toContainText('Test.pdf');
    await expect(stage).toContainText('image0.jpg');
    await byFieldId(page, 'Textbox_Text').fill('component playground');
    await expectFormOutput(page, { Textbox_Text: 'component playground' });
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
