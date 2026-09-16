import type { AtLocalizationLocale, AtMessageValue, AtMessageValues } from './localization.type';

type MessageNode =
    | { type: 'text'; value: string }
    | { type: 'argument'; name: string; format?: 'number' | 'date' | 'time' }
    | {
        type: 'choice';
        name: string;
        choiceType: 'select' | 'plural' | 'selectordinal';
        options: Record<string, MessageNode[]>;
    };

export interface AtCompiledMessage {
    readonly parameterNames: readonly string[];
    format: (values?: AtMessageValues) => string;
}

interface FormatContext {
    poundValue?: number;
}

const parsedMessageCache = new Map<string, MessageNode[]>();
const safeLocaleCache = new Map<string, string>();
const numberFormatCache = new Map<string, Intl.NumberFormat>();
const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>();
const pluralRulesCache = new Map<string, Intl.PluralRules>();

const getSafeLocale = (locale?: string): string => {
    const requested = locale || 'en-US';
    const cached = safeLocaleCache.get(requested);
    if (cached)
        return cached;

    let safeLocale = 'en-US';
    try {
        safeLocale = Intl.getCanonicalLocales(requested)[0] || 'en-US';
    }
    catch {
        // The application language key may be a non-BCP-47 value. Intl formatting alone falls back.
    }

    safeLocaleCache.set(requested, safeLocale);
    return safeLocale;
};

const splitTopLevel = (value: string, separator: string, maxParts?: number): string[] => {
    const result: string[] = [];
    let depth = 0;
    let start = 0;

    for (let index = 0; index < value.length; index++) {
        const char = value[index];
        if (char === '{')
            depth++;
        else if (char === '}')
            depth--;
        else if (char === separator && depth === 0 && (!maxParts || result.length < maxParts - 1)) {
            result.push(value.slice(start, index));
            start = index + 1;
        }
    }

    result.push(value.slice(start));
    return result;
};

const parseChoiceOptions = (source: string): Record<string, MessageNode[]> => {
    const options: Record<string, MessageNode[]> = {};
    let index = 0;

    while (index < source.length) {
        while (index < source.length && /\s/.test(source[index])) index++;
        if (index >= source.length)
            break;

        const keyStart = index;
        while (index < source.length && !/\s|\{/.test(source[index])) index++;
        const optionKey = source.slice(keyStart, index).trim();
        while (index < source.length && /\s/.test(source[index])) index++;

        if (!optionKey || source[index] !== '{')
            throw new Error(`Invalid choice branch near "${source.slice(keyStart)}".`);

        const contentStart = ++index;
        let depth = 1;
        while (index < source.length && depth > 0) {
            if (source[index] === '{') depth++;
            else if (source[index] === '}') depth--;
            index++;
        }

        if (depth !== 0)
            throw new Error(`Unclosed choice branch "${optionKey}".`);

        options[optionKey] = parseMessage(source.slice(contentStart, index - 1));
    }

    return options;
};

const parseArgument = (source: string): MessageNode => {
    const parts = splitTopLevel(source, ',', 3).map((item) => item.trim());
    const name = parts[0];
    if (!name)
        throw new Error('Message argument name cannot be empty.');

    if (parts.length === 1)
        return { type: 'argument', name };

    const format = parts[1];
    if (format === 'number' || format === 'date' || format === 'time')
        return { type: 'argument', name, format };

    if (format === 'select' || format === 'plural' || format === 'selectordinal') {
        const options = parseChoiceOptions(parts[2] || '');
        if (!options.other)
            throw new Error(`${format} argument "${name}" must define an other branch.`);

        return {
            type: 'choice',
            name,
            choiceType: format,
            options,
        };
    }

    throw new Error(`Unsupported message argument format "${format}".`);
};

const parseMessage = (message: string): MessageNode[] => {
    const nodes: MessageNode[] = [];
    let textStart = 0;
    let index = 0;

    const pushText = (end: number) => {
        if (end > textStart)
            nodes.push({ type: 'text', value: message.slice(textStart, end) });
    };

    while (index < message.length) {
        if (message[index] === '}')
            throw new Error(`Unexpected closing brace at position ${index}.`);

        if (message[index] !== '{') {
            index++;
            continue;
        }

        pushText(index);
        const contentStart = ++index;
        let depth = 1;
        while (index < message.length && depth > 0) {
            if (message[index] === '{') depth++;
            else if (message[index] === '}') depth--;
            index++;
        }

        if (depth !== 0)
            throw new Error(`Unclosed message argument at position ${contentStart - 1}.`);

        nodes.push(parseArgument(message.slice(contentStart, index - 1)));
        textStart = index;
    }

    pushText(message.length);
    return nodes;
};

const getParsedMessage = (message: string): MessageNode[] => {
    const cached = parsedMessageCache.get(message);
    if (cached)
        return cached;

    const parsed = parseMessage(message);
    parsedMessageCache.set(message, parsed);
    return parsed;
};

const getNumberFormatter = (locale: string): Intl.NumberFormat => {
    const safeLocale = getSafeLocale(locale);
    let formatter = numberFormatCache.get(safeLocale);
    if (!formatter) {
        formatter = new Intl.NumberFormat(safeLocale);
        numberFormatCache.set(safeLocale, formatter);
    }
    return formatter;
};

const getDateTimeFormatter = (
    locale: string,
    calendar: string | undefined,
    kind: 'date' | 'time',
): Intl.DateTimeFormat => {
    const safeLocale = getSafeLocale(locale);
    const key = `${safeLocale}|${calendar || ''}|${kind}`;
    let formatter = dateTimeFormatCache.get(key);
    if (!formatter) {
        const options: Intl.DateTimeFormatOptions = kind === 'date'
            ? { year: 'numeric', month: 'short', day: 'numeric' }
            : { hour: 'numeric', minute: '2-digit', second: '2-digit' };
        if (calendar)
            options.calendar = calendar;
        formatter = new Intl.DateTimeFormat(safeLocale, options);
        dateTimeFormatCache.set(key, formatter);
    }
    return formatter;
};

const getPluralRules = (locale: string, ordinal: boolean): Intl.PluralRules => {
    const safeLocale = getSafeLocale(locale);
    const key = `${safeLocale}|${ordinal ? 'ordinal' : 'cardinal'}`;
    let rules = pluralRulesCache.get(key);
    if (!rules) {
        rules = new Intl.PluralRules(safeLocale, { type: ordinal ? 'ordinal' : 'cardinal' });
        pluralRulesCache.set(key, rules);
    }
    return rules;
};

const toDate = (value: AtMessageValue): Date | null => {
    if (value instanceof Date)
        return Number.isNaN(value.getTime()) ? null : value;

    if (typeof value === 'number' || typeof value === 'string') {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    return null;
};

const formatNodes = (
    nodes: readonly MessageNode[],
    values: AtMessageValues,
    locale: AtLocalizationLocale,
    context: FormatContext = {},
): string => nodes.map((node) => {
    if (node.type === 'text') {
        if (context.poundValue === undefined || node.value.indexOf('#') === -1)
            return node.value;
        return node.value.split('#').join(getNumberFormatter(locale.locale).format(context.poundValue));
    }

    const value = values[node.name];

    if (node.type === 'argument') {
        if (value === null || value === undefined)
            return '';

        if (node.format === 'number') {
            const numericValue = typeof value === 'number' ? value : Number(value);
            return Number.isFinite(numericValue)
                ? getNumberFormatter(locale.locale).format(numericValue)
                : String(value);
        }

        if (node.format === 'date' || node.format === 'time') {
            const date = toDate(value);
            return date
                ? getDateTimeFormatter(locale.locale, locale.calendar, node.format).format(date)
                : String(value);
        }

        return String(value);
    }

    if (node.choiceType === 'select') {
        const selectedKey = String(value ?? 'other');
        const branch = node.options[selectedKey] || node.options.other;
        return formatNodes(branch, values, locale, context);
    }

    const numericValue = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numericValue))
        return formatNodes(node.options.other, values, locale, context);

    const exactBranch = node.options[`=${numericValue}`];
    const selectedBranch = exactBranch || node.options[
        getPluralRules(locale.locale, node.choiceType === 'selectordinal').select(numericValue)
    ] || node.options.other;

    return formatNodes(selectedBranch, values, locale, { poundValue: numericValue });
}).join('');

const collectParameterNames = (nodes: readonly MessageNode[], result: Set<string>) => {
    nodes.forEach((node) => {
        if (node.type === 'text')
            return;

        result.add(node.name);
        if (node.type === 'choice')
            Object.values(node.options).forEach((branch) => collectParameterNames(branch, result));
    });
};

export const compileAtMessage = (
    message: string,
    locale: AtLocalizationLocale | string = 'en-US',
): AtCompiledMessage => {
    const parsed = getParsedMessage(message);
    const resolvedLocale: AtLocalizationLocale = typeof locale === 'string'
        ? { locale }
        : { locale: locale.locale || 'en-US', calendar: locale.calendar };
    const parameterNames = new Set<string>();
    collectParameterNames(parsed, parameterNames);

    return {
        parameterNames: Array.from(parameterNames),
        format: (values: AtMessageValues = {}) => formatNodes(parsed, values, resolvedLocale),
    };
};

export const getAtMessageParameterNames = (message: string): readonly string[] =>
    compileAtMessage(message).parameterNames;
