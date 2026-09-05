import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'MultiForm';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('keeps the beta multi-form example wired to normal form change output', async ({ page }) => {
    await byFieldId(page, 'Name').fill('multi');
    await expectFormOutput(page, { Name: 'multi' });
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
