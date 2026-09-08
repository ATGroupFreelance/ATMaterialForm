import { test, expect } from '@playwright/test';
import {
    byFieldId,
    expectExampleScreenshot,
    expectFormOutput,
    openExample,
} from '../../../testing/playwright/exampleHarness';

const EXAMPLE = 'FormLayouts';

test.describe(EXAMPLE, () => {
    test.beforeEach(async ({ page }) => {
        await openExample(page, EXAMPLE);
    });

    test('renders built-in, custom, nested, and wrapped layout content', async ({ page }) => {
        await expect(page.getByText('Card layout — Personal information', { exact: true })).toBeVisible();
        await expect(page.getByText('Box layout — Address', { exact: true })).toBeVisible();
        await expect(page.getByText('Section layout — Contact details', { exact: true })).toBeVisible();
        await expect(page.getByText('Paper layout — Company', { exact: true })).toBeVisible();
        await expect(page.locator('#address-box')).toBeVisible();
        await expect(page.locator('#contact-section')).toBeVisible();
        await expect(page.locator('#company-paper')).toBeVisible();
        await expect(page.getByText('Custom layout — Custom renderer', { exact: true })).toBeVisible();
        await expect(page.getByText('Card layout — Nested group', { exact: true })).toBeVisible();
        await expect(byFieldId(page, 'LastName')).toBeVisible();
    });

    test('uses theme-aware premium defaults', async ({ page }) => {
        const card = page.locator('#personal-information-card');
        const cardHeader = page.locator('#personal-information-card-header');
        const box = page.locator('#address-box');
        const paper = page.locator('#company-paper');

        await expect(box).toHaveCSS('border-style', 'dashed');
        await expect(card).toHaveCSS('border-radius', '10px');
        await expect(box).toHaveCSS('border-radius', '10px');
        await expect(paper).toHaveCSS('border-radius', '10px');

        const cardHeaderBox = await cardHeader.boundingBox();
        expect(cardHeaderBox?.height).toBeLessThanOrEqual(64);

        const lightCardHeaderBackground = await cardHeader.evaluate((element) => getComputedStyle(element).backgroundColor);
        const lightBoxBackground = await box.evaluate((element) => getComputedStyle(element).backgroundColor);
        const lightPaperBackground = await paper.evaluate((element) => getComputedStyle(element).backgroundColor);

        await page.getByRole('button', { name: 'Dark theme', exact: true }).click();

        const darkCardHeaderBackground = await cardHeader.evaluate((element) => getComputedStyle(element).backgroundColor);
        const darkBoxBackground = await box.evaluate((element) => getComputedStyle(element).backgroundColor);
        const darkPaperBackground = await paper.evaluate((element) => getComputedStyle(element).backgroundColor);

        expect(darkCardHeaderBackground).not.toBe(lightCardHeaderBackground);
        expect(darkBoxBackground).not.toBe(lightBoxBackground);
        expect(darkPaperBackground).not.toBe(lightPaperBackground);
    });

    test('keeps layout metadata out of form output', async ({ page }) => {
        await byFieldId(page, 'FirstName').fill('Ada');
        await byFieldId(page, 'City').fill('London');
        await byFieldId(page, 'Email').fill('ada@example.com');
        await byFieldId(page, 'CompanyName').fill('Analytical Engines');
        await byFieldId(page, 'CustomField').fill('custom');
        await byFieldId(page, 'NestedField').fill('nested');

        await expectFormOutput(page, {
            FirstName: 'Ada',
            City: 'London',
            Email: 'ada@example.com',
            CompanyName: 'Analytical Engines',
            CustomField: 'custom',
            NestedField: 'nested',
        });

        const output = JSON.parse(await page.getByTestId('realtime-form-data').textContent() || '{}');
        expect(output.PersonalInformation).toBeUndefined();
        expect(output.AddressBox).toBeUndefined();
        expect(output.ContactSection).toBeUndefined();
        expect(output.CompanyPaper).toBeUndefined();
        expect(output.CustomPanel).toBeUndefined();
        expect(output.NestedCard).toBeUndefined();
    });

    test('preserves flat tab behavior across a nested layout boundary', async ({ page }) => {
        await expect(page.getByRole('tab', { name: 'Profile' })).toBeVisible();
        await expect(page.getByRole('tab', { name: 'Contact' })).toBeVisible();
        await expect(byFieldId(page, 'TabbedProfile')).toBeVisible();
        await expect(byFieldId(page, 'TabbedContact')).toBeHidden();
        await expect(page.locator('#tabbed-nested-box')).toBeHidden();

        await byFieldId(page, 'TabbedProfile').fill('retained');
        await page.getByRole('tab', { name: 'Contact' }).click();
        await expect(byFieldId(page, 'TabbedProfile')).toBeHidden();
        await expect(byFieldId(page, 'TabbedContact')).toBeVisible();
        await expect(page.locator('#tabbed-nested-box')).toBeVisible();

        await byFieldId(page, 'TabbedContact').fill('contact');
        await page.getByRole('tab', { name: 'Profile' }).click();
        await expect(byFieldId(page, 'TabbedProfile')).toHaveValue('retained');
        await expectFormOutput(page, {
            TabbedProfile: 'retained',
            TabbedContact: 'contact',
        });
    });

    test('visual regression', async ({ page }) => {
        await expectExampleScreenshot(page, EXAMPLE);
    });
});
