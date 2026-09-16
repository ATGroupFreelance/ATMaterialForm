import type { AtMessageDefinition, AtMessageTranslationMap } from './localization.type';

export const createMessageDefinitionsFromDefaults = (
    defaults: AtMessageTranslationMap,
): AtMessageDefinition[] => Object.entries(defaults).map(([key, defaultMessage]) => ({
    key,
    defaultMessage,
}));
