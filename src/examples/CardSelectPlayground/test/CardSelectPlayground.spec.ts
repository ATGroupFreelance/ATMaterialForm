import { test, expect } from '@playwright/test';
import { expectExampleScreenshot, expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'CardSelectPlayground';

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('selects one card, stores its id and deselects it when clicked again', async ({ page }) => {
    const darkFiber = page.getByRole('radio', { name: 'Dark Fiber', exact: true });
    const internetFiber = page.getByRole('radio', { name: 'Internet over Fiber', exact: true });

    await expect(darkFiber).toHaveAttribute('aria-checked', 'true');
    await expectFormOutput(page, { ServiceId: 'DARK-FIBER' });

    await darkFiber.click();
    await expect(darkFiber).toHaveAttribute('aria-checked', 'false');
    await expectFormOutput(page, { ServiceId: null });

    await internetFiber.click();
    await expect(internetFiber).toHaveAttribute('aria-checked', 'true');
    await expect(darkFiber).toHaveAttribute('aria-checked', 'false');
    await expectFormOutput(page, { ServiceId: 'INET-FIBER' });
  });

  test('clears a required validation error after a valid card is selected', async ({ page }) => {
    const cardSelect = page.getByRole('radiogroup', { name: 'Choose a business service' });
    const darkFiber = page.getByRole('radio', { name: 'Dark Fiber', exact: true });
    const internetFiber = page.getByRole('radio', { name: 'Internet over Fiber', exact: true });
    const submit = page.getByRole('button', { name: 'Submit', exact: true });

    await darkFiber.click();
    await expectFormOutput(page, { ServiceId: null });

    await submit.click();
    await expect(cardSelect).toHaveAttribute('aria-invalid', 'true');

    await internetFiber.click();
    await expect(cardSelect).not.toHaveAttribute('aria-invalid', 'true');
    await expectFormOutput(page, { ServiceId: 'INET-FIBER' });

    await submit.click();
    await expect(cardSelect).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('visual regression', async ({ page }) => {
    await expectExampleScreenshot(page, EXAMPLE);
  });
});
