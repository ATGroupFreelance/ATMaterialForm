import { test, expect } from '@playwright/test';
import { expectExampleScreenshot, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'Playground';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('runs the async data hook and renders its resolved value', async ({ page }) => {
    const stage = page.getByTestId('example-stage');
    await expect(stage).toContainText('ChildComponent');

    await stage.getByRole('button', { name: 'Playground', exact: true }).click();
    await expect(stage).toContainText('2');
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
