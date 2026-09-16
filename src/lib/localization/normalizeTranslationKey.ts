import type { AtTranslationKey } from './localization.type';

export const normalizeTranslationKey = (key: AtTranslationKey): string =>
    key.normalize('NFKC').trim().toLocaleLowerCase('en-US');
