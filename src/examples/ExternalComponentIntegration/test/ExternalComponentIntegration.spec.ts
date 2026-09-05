import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'ExternalComponentIntegration';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('renders JSON field and registered React custom component together', async ({ page }) => {
    await expect(byFieldId(page, 'Form Text Box')).toBeVisible();
    const custom = page.getByLabel('CustomComponentTextField', { exact: true });
    await expect(custom).toBeVisible();
    await byFieldId(page, 'Form Text Box').fill('library');
    await custom.fill('custom');
    await expectFormOutput(page, { 'Form Text Box': 'library', CustomComponentTextField: 'custom' });
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
