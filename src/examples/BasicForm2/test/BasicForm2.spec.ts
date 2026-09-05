import { test, expect } from '@playwright/test';
import { byFieldId, expectExampleScreenshot, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'BasicForm2';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('honors default value and field-level reset ref', async ({ page }) => {
    const input = byFieldId(page, 'MyTextBox1');
    await expect(input).toHaveValue('Test');
    await input.fill('Changed');
    await page.getByRole('button', { name: 'Click Me to reset MyTextBox1!' }).click();
    await expect(input).toHaveValue('Test');
  });

  test('restores a locally saved form snapshot and verifies the full form-data round trip', async ({ page }) => {
    await openExample(page, EXAMPLE, { inspector: true });

    const input = byFieldId(page, 'MyTextBox1');
    await input.fill('Snapshot value');
    await page.getByRole('button', { name: 'Take snapshot', exact: true }).click();

    await input.fill('Changed after snapshot');
    await expect(input).toHaveValue('Changed after snapshot');

    await page.getByRole('button', { name: 'Reset to snapshot & verify', exact: true }).click();

    await expect(input).toHaveValue('Snapshot value');
    await expect(page.getByText('Restore verified — all three form-data formats match the saved snapshot.')).toBeVisible();
  });


  test('shows an inspectable JSON diff when restored form data does not match the saved snapshot', async ({ page }) => {
    await openExample(page, EXAMPLE, { inspector: true });

    const input = byFieldId(page, 'MyTextBox1');
    await input.fill('Snapshot value');
    await page.getByRole('button', { name: 'Take snapshot', exact: true }).click();

    await page.evaluate((exampleId) => {
      const key = `atmaterialform.form-snapshot.v1.${exampleId}`;
      const snapshot = JSON.parse(window.localStorage.getItem(key) || 'null');

      if (!snapshot) throw new Error('Expected the test snapshot to exist.');

      snapshot.data.formDataKeyValue = {
        __forcedExpectedMismatch: 'This value should never be returned by the form',
      };
      window.localStorage.setItem(key, JSON.stringify(snapshot));
    }, EXAMPLE);

    await openExample(page, EXAMPLE, { inspector: true });
    await page.getByRole('button', { name: 'Reset to snapshot & verify', exact: true }).click();

    await expect(page.getByText('Restore mismatch detected.')).toBeVisible();
    await page.getByRole('button', { name: 'View diff', exact: true }).click();

    const dialog = page.getByRole('dialog', { name: 'Snapshot mismatch details' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('SAVED SNAPSHOT')).toBeVisible();
    await expect(dialog.getByText('AFTER RESTORE')).toBeVisible();
    await expect(dialog.getByText(/__forcedExpectedMismatch/)).toBeVisible();
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
