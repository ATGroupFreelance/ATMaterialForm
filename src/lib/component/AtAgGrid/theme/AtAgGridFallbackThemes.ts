import { themeQuartz } from 'ag-grid-community';
import type { AtFormAgGridTheme } from '../../../types/AtAgGridTheme.type';

const fontFamily = "Poppins, IRANSans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";

export const atAgGridLightFallback: AtFormAgGridTheme = themeQuartz.withParams({
    accentColor: '#087AD1',
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E2E6',
    borderRadius: 2,
    browserColorScheme: 'light',
    cellHorizontalPaddingScale: 0.7,
    fontFamily,
    fontSize: 14,
    foregroundColor: '#555B62',
    headerBackgroundColor: '#F2F2F2',
    headerFontSize: 13,
    headerFontWeight: 600,
    headerTextColor: '#000000',
    oddRowBackgroundColor: '#F2F2F2',
    rowBorder: false,
    headerRowBorder: true,
    rowVerticalPaddingScale: 1,
    spacing: 8,
    wrapperBorder: true,
    wrapperBorderRadius: 20,
});

export const atAgGridDarkFallback: AtFormAgGridTheme = themeQuartz.withParams({
    backgroundColor: '#1F2836',
    browserColorScheme: 'dark',
    foregroundColor: '#FFFFFF',
    fontFamily,
    fontSize: 14,
    headerFontSize: 14,
    oddRowBackgroundColor: '#303A48',
    wrapperBorder: true,
    wrapperBorderRadius: 20,
});
