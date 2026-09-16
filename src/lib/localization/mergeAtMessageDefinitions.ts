import type { AtMessageDefinition } from './localization.type';
import { normalizeTranslationKey } from './normalizeTranslationKey';

export const mergeAtMessageDefinitions = (
    ...groups: Array<readonly AtMessageDefinition[] | null | undefined>
): AtMessageDefinition[] => {
    const result = new Map<string, AtMessageDefinition>();

    groups.forEach((group) => group?.forEach((definition) => {
        const normalizedKey = normalizeTranslationKey(definition.key);
        if (result.has(normalizedKey))
            result.delete(normalizedKey);
        result.set(normalizedKey, definition);
    }));

    return Array.from(result.values());
};
