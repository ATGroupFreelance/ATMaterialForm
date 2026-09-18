import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, expectFormOutput, openExample, selectAutocompleteOption } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'BasicForm';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('updates computed A + B and toggles conditional slider', async ({ page }) => {
    await byFieldId(page, 'A').fill('2');
    await byFieldId(page, 'B').fill('3');
    await expect(byFieldId(page, 'A + B')).toHaveValue('5');
    await expect(page.getByText('Slider', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Hide some elements' }).click();
    await expect(page.getByText('Slider', { exact: true })).toHaveCount(0);
    await expectFormOutput(page, { A: '2', B: '3' });
  });

  test('keeps ComboBox string ids and MultiComboBox id arrays in form output', async ({ page }) => {
    await selectAutocompleteOption(page, 'ComboBoxEnumsless', 'UK');
    await selectAutocompleteOption(page, 'CountriesIDVALUE', 'UK');
    await selectAutocompleteOption(page, 'CountriesIDVALUE', 'US');

    await expectFormOutput(page, {
      ComboBoxEnumsless: 'uk',
      CountriesIDVALUE: [1, 2],
    });
  });

  test('switches the playground to dark theme without changing the example', async ({ page }) => {
    const darkThemeButton = page.getByRole('button', { name: 'Dark theme', exact: true });
    const before = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await darkThemeButton.click();
    await expect(darkThemeButton).toHaveAttribute('aria-pressed', 'true');

    const after = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(after).not.toBe(before);
    await expect(page.getByTestId('example-stage')).toHaveAttribute('data-example-id', EXAMPLE);
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
