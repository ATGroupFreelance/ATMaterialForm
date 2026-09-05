import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'AgGridCellRendererTemplates';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('renders configured grid rows and custom/template columns', async ({ page }) => {
    const stage = page.getByTestId('example-stage');
    await expect(stage).toContainText('Toyota');
    await expect(stage).toContainText('Ford');
    await expect(stage).toContainText('Porsche');
    await expect(stage).toContainText('Make');
    await expect(stage).toContainText('Model');
    await expect(stage).toContainText('Price');
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
