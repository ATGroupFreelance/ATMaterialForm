import { compileAtMessage, getAtMessageParameterNames, type AtCompiledMessage } from './messageFormatter';
import type {
    AtLocalizationDiagnostic,
    AtLocalizer,
    AtMessageDefinition,
    AtMessageValues,
    AtTranslationKey,
    CreateAtLocalizerOptions,
} from './localization.type';
import { normalizeTranslationKey } from './normalizeTranslationKey';

interface NormalizedTranslation {
    key: string;
    message: string;
}

interface NormalizedDefinition {
    key: string;
    definition: AtMessageDefinition;
}

interface RuntimeMessage {
    key: string;
    message: string;
    compiled?: AtCompiledMessage;
    definition?: AtMessageDefinition;
}

const hasDynamicSyntax = (message: string): boolean => message.indexOf('{') >= 0;

export const createAtLocalizer = (options: CreateAtLocalizerOptions = {}): AtLocalizer => {
    const locale = options.locale || 'en-US';
    const calendar = options.calendar;
    const diagnostics: AtLocalizationDiagnostic[] = [];
    const diagnosticKeys = new Set<string>();
    const translations = new Map<string, NormalizedTranslation>();
    const definitions = new Map<string, NormalizedDefinition>();
    const aliasToCanonical = new Map<string, string>();
    const runtimeMessages = new Map<string, RuntimeMessage>();

    const addDiagnostic = (diagnostic: AtLocalizationDiagnostic) => {
        const diagnosticKey = [
            diagnostic.code,
            diagnostic.key || '',
            diagnostic.relatedKey || '',
            diagnostic.parameter || '',
            diagnostic.message,
        ].join('\u0000');

        if (diagnosticKeys.has(diagnosticKey))
            return;

        diagnosticKeys.add(diagnosticKey);
        diagnostics.push(diagnostic);
    };

    Object.entries(options.messages || {}).forEach(([key, message]) => {
        const normalizedKey = normalizeTranslationKey(key);
        const existing = translations.get(normalizedKey);
        if (existing) {
            addDiagnostic({
                code: 'duplicate-translation',
                key,
                relatedKey: existing.key,
                message: `Translation key "${key}" duplicates "${existing.key}" case-insensitively.`,
            });
        }
        translations.set(normalizedKey, { key, message });
    });

    (options.definitions || []).forEach((definition) => {
        const normalizedKey = normalizeTranslationKey(definition.key);
        const existing = definitions.get(normalizedKey);
        if (existing) {
            addDiagnostic({
                code: 'duplicate-definition',
                key: definition.key,
                relatedKey: existing.key,
                message: `Message definition "${definition.key}" duplicates "${existing.key}" case-insensitively.`,
            });
        }
        definitions.set(normalizedKey, { key: definition.key, definition });
    });

    definitions.forEach(({ definition }, canonicalKey) => {
        (definition.aliases || []).forEach((alias) => {
            const normalizedAlias = normalizeTranslationKey(alias);
            if (normalizedAlias === canonicalKey) {
                addDiagnostic({
                    code: 'duplicate-alias',
                    key: definition.key,
                    relatedKey: alias,
                    message: `Alias "${alias}" duplicates its canonical key.`,
                });
                return;
            }

            const existingAliasOwner = aliasToCanonical.get(normalizedAlias);
            if (existingAliasOwner && existingAliasOwner !== canonicalKey) {
                addDiagnostic({
                    code: 'duplicate-alias',
                    key: definition.key,
                    relatedKey: alias,
                    message: `Alias "${alias}" is already owned by another message definition.`,
                });
                return;
            }

            if (definitions.has(normalizedAlias) && normalizedAlias !== canonicalKey) {
                addDiagnostic({
                    code: 'alias-conflict',
                    key: definition.key,
                    relatedKey: alias,
                    message: `Alias "${alias}" conflicts with an existing message definition.`,
                });
                return;
            }

            aliasToCanonical.set(normalizedAlias, canonicalKey);
        });
    });

    const resolveTranslationForDefinition = (canonicalKey: string, definition: AtMessageDefinition): string | undefined => {
        const canonicalTranslation = translations.get(canonicalKey);
        const aliasTranslations = (definition.aliases || [])
            .map((alias) => translations.get(normalizeTranslationKey(alias)))
            .filter((item): item is NormalizedTranslation => !!item);

        const allTranslations = canonicalTranslation
            ? [canonicalTranslation, ...aliasTranslations]
            : aliasTranslations;

        if (allTranslations.length > 1) {
            const firstMessage = allTranslations[0].message;
            if (allTranslations.some((item) => item.message !== firstMessage)) {
                addDiagnostic({
                    code: 'alias-translation-conflict',
                    key: definition.key,
                    message: `Canonical/alias translations for "${definition.key}" disagree. The canonical translation, when present, wins.`,
                });
            }
        }

        return canonicalTranslation ? canonicalTranslation.message : aliasTranslations[0]?.message;
    };

    interface ResolvedDefinitionMessage {
        message: string;
        translated: boolean;
    }

    const resolvedMessageCache = new Map<string, ResolvedDefinitionMessage>();
    const resolving = new Set<string>();

    const resolveDefinitionMessage = (canonicalKey: string): ResolvedDefinitionMessage => {
        const cached = resolvedMessageCache.get(canonicalKey);
        if (cached)
            return cached;

        const normalizedDefinition = definitions.get(canonicalKey);
        if (!normalizedDefinition) {
            const translation = translations.get(canonicalKey);
            return translation
                ? { message: translation.message, translated: true }
                : { message: '', translated: false };
        }

        const { definition } = normalizedDefinition;
        const directTranslation = resolveTranslationForDefinition(canonicalKey, definition);
        if (directTranslation !== undefined) {
            const resolved = { message: directTranslation, translated: true };
            resolvedMessageCache.set(canonicalKey, resolved);
            return resolved;
        }

        if (definition.fallbackKey) {
            if (resolving.has(canonicalKey)) {
                addDiagnostic({
                    code: 'fallback-cycle',
                    key: definition.key,
                    relatedKey: definition.fallbackKey,
                    message: `Fallback cycle detected while resolving "${definition.key}".`,
                });
                const resolved = { message: definition.defaultMessage, translated: false };
                resolvedMessageCache.set(canonicalKey, resolved);
                return resolved;
            }

            resolving.add(canonicalKey);
            const fallbackNormalized = normalizeTranslationKey(definition.fallbackKey);
            const fallbackCanonical = aliasToCanonical.get(fallbackNormalized) || fallbackNormalized;
            const fallback = definitions.has(fallbackCanonical)
                ? resolveDefinitionMessage(fallbackCanonical)
                : (() => {
                    const translation = translations.get(fallbackCanonical);
                    return translation
                        ? { message: translation.message, translated: true }
                        : { message: '', translated: false };
                })();
            resolving.delete(canonicalKey);

            if (fallback.translated) {
                resolvedMessageCache.set(canonicalKey, fallback);
                return fallback;
            }
        }

        const resolved = { message: definition.defaultMessage, translated: false };
        resolvedMessageCache.set(canonicalKey, resolved);
        return resolved;
    };

    const compileRuntimeMessage = (
        key: string,
        message: string,
        definition?: AtMessageDefinition,
    ): RuntimeMessage => {
        let resolvedMessage = message;
        let compiled: AtCompiledMessage | undefined;

        if (definition?.parameters) {
            try {
                const parameterNames = new Set(getAtMessageParameterNames(message));
                parameterNames.forEach((parameter) => {
                    if (!definition.parameters?.[parameter]) {
                        addDiagnostic({
                            code: 'unknown-parameter',
                            key: definition.key,
                            parameter,
                            message: `Message "${definition.key}" references undeclared parameter "${parameter}".`,
                        });
                    }
                });

                Object.entries(definition.parameters).forEach(([parameter, parameterDefinition]) => {
                    if (parameterDefinition.required && !parameterNames.has(parameter)) {
                        addDiagnostic({
                            code: 'missing-required-parameter',
                            key: definition.key,
                            parameter,
                            message: `Message "${definition.key}" does not reference required parameter "${parameter}".`,
                        });
                    }
                });
            }
            catch {
                // Parsing/invalid-message handling below owns the actual syntax diagnostic.
            }
        }

        if (hasDynamicSyntax(message)) {
            try {
                compiled = compileAtMessage(message, { locale, calendar });
            }
            catch (error) {
                addDiagnostic({
                    code: 'invalid-message',
                    key: definition?.key || key,
                    message: `Invalid localized message: ${error instanceof Error ? error.message : String(error)}`,
                });

                const fallbackMessage = definition?.defaultMessage;
                if (fallbackMessage !== undefined && fallbackMessage !== message) {
                    resolvedMessage = fallbackMessage;
                    try {
                        compiled = hasDynamicSyntax(fallbackMessage)
                            ? compileAtMessage(fallbackMessage, { locale, calendar })
                            : undefined;
                    }
                    catch (fallbackError) {
                        addDiagnostic({
                            code: 'invalid-message',
                            key: definition?.key || key,
                            message: `Invalid default message: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`,
                        });
                    }
                }
            }
        }

        return { key, message: resolvedMessage, compiled, definition };
    };

    definitions.forEach(({ definition }, canonicalKey) => {
        const { message } = resolveDefinitionMessage(canonicalKey);
        const runtimeMessage = compileRuntimeMessage(canonicalKey, message, definition);
        runtimeMessages.set(canonicalKey, runtimeMessage);

        (definition.aliases || []).forEach((alias) => {
            const normalizedAlias = normalizeTranslationKey(alias);
            if (aliasToCanonical.get(normalizedAlias) === canonicalKey)
                runtimeMessages.set(normalizedAlias, runtimeMessage);
        });
    });

    translations.forEach(({ message }, normalizedKey) => {
        if (runtimeMessages.has(normalizedKey) || aliasToCanonical.has(normalizedKey))
            return;
        runtimeMessages.set(normalizedKey, compileRuntimeMessage(normalizedKey, message));
    });

    const formatRuntimeMessage = (runtimeMessage: RuntimeMessage, values?: AtMessageValues): string => {
        const requiredParameters = runtimeMessage.definition?.parameters;
        if (requiredParameters) {
            Object.entries(requiredParameters).forEach(([parameter, parameterDefinition]) => {
                if (parameterDefinition.required && (values?.[parameter] === undefined || values?.[parameter] === null)) {
                    addDiagnostic({
                        code: 'missing-required-parameter',
                        key: runtimeMessage.definition?.key,
                        parameter,
                        message: `Required parameter "${parameter}" was not supplied for "${runtimeMessage.definition?.key}".`,
                    });
                }
            });

            if (values) {
                Object.keys(values).forEach((parameter) => {
                    if (!requiredParameters[parameter]) {
                        addDiagnostic({
                            code: 'unknown-parameter',
                            key: runtimeMessage.definition?.key,
                            parameter,
                            message: `Unknown parameter "${parameter}" was supplied for "${runtimeMessage.definition?.key}".`,
                        });
                    }
                });
            }
        }

        if (!runtimeMessage.compiled)
            return runtimeMessage.message;

        try {
            return runtimeMessage.compiled.format(values || {});
        }
        catch (error) {
            addDiagnostic({
                code: 'invalid-message',
                key: runtimeMessage.definition?.key || runtimeMessage.key,
                message: `Message formatting failed: ${error instanceof Error ? error.message : String(error)}`,
            });
            return runtimeMessage.message;
        }
    };

    const translate = (
        key: string | null | undefined,
        fallbackOrValues?: string | AtMessageValues,
        values?: AtMessageValues,
    ): string | null | undefined => {
        if (key === null || key === undefined)
            return key;

        const normalizedKey = normalizeTranslationKey(key);
        const runtimeMessage = runtimeMessages.get(normalizedKey);
        const suppliedValues = typeof fallbackOrValues === 'string' ? values : fallbackOrValues;
        if (runtimeMessage)
            return formatRuntimeMessage(runtimeMessage, suppliedValues);

        const fallback = typeof fallbackOrValues === 'string' ? fallbackOrValues : key;
        if (suppliedValues && hasDynamicSyntax(fallback)) {
            try {
                return compileAtMessage(fallback, { locale, calendar }).format(suppliedValues);
            }
            catch (error) {
                addDiagnostic({
                    code: 'invalid-message',
                    key,
                    message: `Fallback message formatting failed: ${error instanceof Error ? error.message : String(error)}`,
                });
            }
        }

        return fallback;
    };

    const t = translate as AtLocalizer['t'];

    return {
        t,
        has: (key: AtTranslationKey) => runtimeMessages.has(normalizeTranslationKey(key)),
        getDiagnostics: () => diagnostics,
    };
};
