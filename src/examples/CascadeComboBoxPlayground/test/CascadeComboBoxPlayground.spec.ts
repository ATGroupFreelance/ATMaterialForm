import { test, expect, type Page } from '@playwright/test';
import { expectFormOutput, openExample } from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'CascadeComboBoxPlayground';

const select = async (page: Page, label: string, option: string) => {
  const input = page.getByLabel(label, { exact: true });
  await input.click();
  await expect(page.getByRole('option', { name: option, exact: true })).toBeVisible();
  await page.getByRole('option', { name: option, exact: true }).click();
};

test.describe(EXAMPLE, () => {
  test.beforeEach(async ({ page }) => {
    await openExample(page, EXAMPLE);
  });

  test('keeps the scalar contract: only the terminal id is persisted', async ({ page }) => {
    await select(page, 'Enum country', 'UK');
    await expectFormOutput(page, { SimpleEnumCascade: null });

    await select(page, 'Enum state', 'England');
    await expectFormOutput(page, { SimpleEnumCascade: null });

    await select(page, 'Enum capital', 'EnglandCapital');
    await expectFormOutput(page, { SimpleEnumCascade: 4 });
    await expect(page.getByLabel('Find any capital', { exact: true })).toHaveValue('EnglandCapital');
  });

  test('changing an ancestor clears the scalar value and reloads descendants', async ({ page }) => {
    await select(page, 'Enum country', 'UK');
    await select(page, 'Enum state', 'England');
    await select(page, 'Enum capital', 'EnglandCapital');
    await expectFormOutput(page, { SimpleEnumCascade: 4 });

    await select(page, 'Enum country', 'US');
    await expectFormOutput(page, { SimpleEnumCascade: null });

    const state = page.getByLabel('Enum state', { exact: true });
    await state.click();
    await expect(page.getByRole('option', { name: 'Alabama', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'England', exact: true })).toHaveCount(0);
  });

  test('whole-tree local search selects the leaf and every ancestor', async ({ page }) => {
    const treeSearch = page.getByLabel('Find any capital', { exact: true });
    await treeSearch.fill('AlabamaCapital');
    await page.getByRole('option').filter({ hasText: 'AlabamaCapital' }).click();

    await expect(page.getByLabel('Enum country', { exact: true })).toHaveValue('US');
    await expect(page.getByLabel('Enum state', { exact: true })).toHaveValue('Alabama');
    await expect(page.getByLabel('Enum capital', { exact: true })).toHaveValue('AlabamaCapital');
    await expectFormOutput(page, { SimpleEnumCascade: 5 });
  });

  test('supports string ids and a shared hierarchical enum', async ({ page }) => {
    await select(page, 'Shared country', 'United Kingdom');
    await select(page, 'Shared state', 'England');
    await select(page, 'Shared city', 'London');
    await expectFormOutput(page, { SharedEnumCascade: 'london' });
  });

  test('supports explicit metadata parent relationships', async ({ page }) => {
    await select(page, 'Business', 'Telecom');
    await select(page, 'System', 'CRM');
    await expectFormOutput(page, { MetadataRelationCascade: 3 });
  });

  test('path-valued cascade exposes every layer id', async ({ page }) => {
    await select(page, 'Path country', 'UK');
    await expectFormOutput(page, {
      PathValueCascade: {
        pathCountry: 1,
        pathState: null,
        pathCapital: null,
      },
    });

    await select(page, 'Path state', 'England');
    await select(page, 'Path capital', 'EnglandCapital');
    await expectFormOutput(page, {
      PathValueCascade: {
        pathCountry: 1,
        pathState: 2,
        pathCapital: 4,
      },
    });
  });

  test('whole-tree search resolves a remote leaf into the complete million-record path', async ({ page }) => {
    await expectFormOutput(page, { LazyMillionCascade: null });

    const treeSearch = page.getByLabel('Find any device', { exact: true });
    await treeSearch.fill('north 4242');
    await page.getByRole('option').filter({ hasText: 'Device 4,242 — North site 1' }).click();

    await expect(page.getByLabel('Large-data region', { exact: true })).toHaveValue('North region');
    await expect(page.getByLabel('Large-data facility', { exact: true })).toHaveValue('North site 1');
    await expect(page.getByLabel('Large-data device', { exact: true })).toHaveValue('Device 4,242');
    await expect(treeSearch).toHaveValue('Device 4,242');
    await expectFormOutput(page, { LazyMillionCascade: 'north-site-1:device:4242' });
  });

  test('searches and pages a logical million-record provider without enumerating it', async ({ page }) => {
    await select(page, 'Large-data region', 'North region');
    await select(page, 'Large-data facility', 'North site 1');

    const device = page.getByLabel('Large-data device', { exact: true });
    await device.click();
    await device.fill('10');
    await expect(page.getByRole('option', { name: 'Device 10', exact: true })).toBeVisible();

    const listbox = page.getByRole('listbox');
    await listbox.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
      element.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
    await expect(page.getByRole('option', { name: 'Device 40', exact: true })).toBeVisible();
  });

  test('distinguishes provider failure from empty results and can retry', async ({ page }) => {
    await page.getByLabel('Failure / retry option', { exact: true }).click();
    await expect(page.getByText('Simulated provider failure. Retry to recover.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await select(page, 'Failure / retry option', 'Recovered option');
    await expectFormOutput(page, { FailureRetryCascade: 'recovered' });
  });

  test('ignores a stale provider response after the parent changes', async ({ page }) => {
    await select(page, 'Provider country', 'UK');
    await select(page, 'Provider country', 'US');

    const state = page.getByLabel('Provider state', { exact: true });
    await state.click();
    await expect(page.getByRole('option', { name: 'California', exact: true })).toBeVisible();
    await page.waitForTimeout(750);
    await expect(page.getByRole('option', { name: 'England', exact: true })).toHaveCount(0);
  });

  test('supports provider ids registered in AtFormConfigProvider', async ({ page }) => {
    await select(page, 'Provider country', 'US');
    await select(page, 'Provider state', 'California');
    await expectFormOutput(page, { RegisteredProviderCascade: 22 });
  });
});
