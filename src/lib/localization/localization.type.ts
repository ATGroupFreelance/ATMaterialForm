export type AtTranslationKey = string;

export type AtTranslationKeyInput = AtTranslationKey | readonly AtTranslationKey[];

export type AtMessageParameterType =
    | 'string'
    | 'number'
    | 'date'
    | 'time'
    | 'boolean'
    | 'select';

export type AtMessageValue = string | number | boolean | Date | null | undefined;
export type AtMessageValues = Record<string, AtMessageValue>;
export type AtMessageExampleValue = AtMessageValue;

export interface AtMessageParameterDefinition {
    type: AtMessageParameterType;
    description?: string;
    required?: boolean;
    options?: string[];
    example?: AtMessageExampleValue;
}

export interface AtMessageDefinition {
    key: AtTranslationKey;
    defaultMessage: string;
    description?: string;
    namespace?: string;
    category?: string;
    parameters?: Record<string, AtMessageParameterDefinition>;
    aliases?: AtTranslationKey[];
    fallbackKey?: AtTranslationKey;
    tags?: string[];
    deprecated?: boolean;
}

export interface AtMessageTranslation {
    key: AtTranslationKey;
    message: string;
}

export type AtMessageTranslationMap = Record<AtTranslationKey, string>;

export interface AtLocalizationLocale {
    locale: string;
    calendar?: string;
}

export type AtLocalizationDiagnosticCode =
    | 'duplicate-definition'
    | 'duplicate-alias'
    | 'alias-conflict'
    | 'alias-translation-conflict'
    | 'fallback-cycle'
    | 'unknown-fallback'
    | 'fallback-parameter-mismatch'
    | 'invalid-message'
    | 'duplicate-translation'
    | 'unknown-parameter'
    | 'missing-required-parameter';

export interface AtLocalizationDiagnostic {
    code: AtLocalizationDiagnosticCode;
    message: string;
    key?: AtTranslationKey;
    parameter?: string;
    relatedKey?: AtTranslationKey;
}

export interface AtLocalizeFunction {
    (
        key: AtTranslationKeyInput,
        fallbackOrValues?: string | AtMessageValues,
        values?: AtMessageValues,
    ): string;
    (
        key: null,
        fallbackOrValues?: string | AtMessageValues,
        values?: AtMessageValues,
    ): null;
    (
        key: undefined,
        fallbackOrValues?: string | AtMessageValues,
        values?: AtMessageValues,
    ): undefined;
    (
        key: AtTranslationKeyInput | null | undefined,
        fallbackOrValues?: string | AtMessageValues,
        values?: AtMessageValues,
    ): string | null | undefined;
}

export interface AtLocalizer {
    t: AtLocalizeFunction;
    has: (key: string) => boolean;
    getDiagnostics: () => readonly AtLocalizationDiagnostic[];
}

export interface CreateAtLocalizerOptions extends Partial<AtLocalizationLocale> {
    messages?: AtMessageTranslationMap;
    definitions?: readonly AtMessageDefinition[];
}
