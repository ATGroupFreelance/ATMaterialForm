import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'HowToUseGroupDataKey';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('groupDataKey groups related values while leaving root values at the root', async ({ page }) => {
    await byFieldId(page, 'firstName').fill('Ada');
    await byFieldId(page, 'lastName').fill('Lovelace');
    await byFieldId(page, 'username').fill('ada');
    await page.getByRole('checkbox', { name: 'I agree to the Terms and Conditions' }).check();
    await expectFormOutput(page, {
      personal: { firstName: 'Ada', lastName: 'Lovelace' },
      account: { username: 'ada' },
      acceptTerms: true,
    });
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
