import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ReactAndJSONComponentTogether';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('React custom controlled field participates in form output beside JSON-built fields', async ({ page }) => {
    const reactField = page.getByLabel('This is from React Component', { exact: true });
    await reactField.fill('react value');
    await byFieldId(page, 'TextBox1').fill('json value');
    await expectFormOutput(page, { TextBox1: 'json value', TextBox2: 'react value' });
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
