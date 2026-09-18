import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useAtFormConfig from '../../../../../hooks/useAtFormConfig/useAtFormConfig';
import { AtEnumItemId, AtEnumItemType, AtEnumType } from '../../../../../types/Common.type';
import {
    AtFormCascadeBaseProps,
    AtFormCascadeLayer,
    AtFormCascadeLeafSearch,
    AtFormCascadeLeafSearchConfig,
    AtFormCascadeLeafSearchItem,
    AtFormCascadeLeafSearchProvider,
    AtFormCascadePathResolver,
    AtFormCascadePathValue,
    AtFormCascadeProvider,
    AtFormCascadeProviderResult,
    AtFormCascadeProviderSource,
    AtFormCascadeResolvedPath,
    AtFormCascadeSource,
} from '../../../../../types/ui/CascadeComboBox.type';
import {
    getCascadeActiveTerminalIndexes,
    getCascadeAffectedIndexes,
    getCascadeDependencyAncestors,
    getCascadeDependencyIndex,
    getCascadeRouteActive,
    getCascadeVisibilityConditions,
    isCascadeLayerReady,
} from './CascadeStructure';

export type CascadeValueMode = 'scalar' | 'path';
export type CascadeLayerStatus = 'blocked' | 'idle' | 'loading' | 'ready' | 'loadingMore' | 'error';

const providerFunctionIds = new WeakMap<AtFormCascadeProvider, number>();
let providerFunctionSequence = 0;

const getProviderFunctionId = (provider: AtFormCascadeProvider) => {
    const existing = providerFunctionIds.get(provider);
    if (existing !== undefined)
        return existing;

    providerFunctionSequence += 1;
    providerFunctionIds.set(provider, providerFunctionSequence);
    return providerFunctionSequence;
};

export interface CascadeLayerState {
    options: AtEnumType;
    status: CascadeLayerStatus;
    error: string | null;
    query: string;
    nextCursor: string | null;
    hasMore: boolean;
}

export type CascadeLeafSearchStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface CascadeLeafSearchState {
    options: AtFormCascadeLeafSearchItem[];
    status: CascadeLeafSearchStatus;
    error: string | null;
    query: string;
}

interface UseCascadeEngineProps extends Pick<AtFormCascadeBaseProps, 'layers' | 'resolver' | 'onPathChange'> {
    leafSearch?: AtFormCascadeLeafSearch;
    mode: CascadeValueMode;
    value: AtEnumItemId | AtFormCascadePathValue | null | undefined;
    emitValue: (value: AtEnumItemId | AtFormCascadePathValue | null) => void;
}

interface FetchLayerResult {
    items: AtEnumType;
    nextCursor: string | null;
    hasMore: boolean;
}

const idsEqual = (left: AtEnumItemId | null | undefined, right: AtEnumItemId | null | undefined) => left === right;

const emptyLayerState = (blocked: boolean): CascadeLayerState => ({
    options: [],
    status: blocked ? 'blocked' : 'idle',
    error: null,
    query: '',
    nextCursor: null,
    hasMore: false,
});

const toPathValue = (layers: AtFormCascadeLayer[], selections: Array<AtEnumItemType | null>): AtFormCascadePathValue => (
    Object.fromEntries(layers.map((layer, index) => [layer.id, selections[index]?.id ?? null]))
);

const toResolvedPath = (layers: AtFormCascadeLayer[], selections: Array<AtEnumItemType | null>): AtFormCascadeResolvedPath => (
    Object.fromEntries(layers.map((layer, index) => [layer.id, selections[index] ?? null]))
);

const sourceSearchConfig = (source: AtFormCascadeProviderSource) => {
    if (!source.search)
        return { enabled: false, minChars: 0, debounceMs: 250 };

    if (source.search === true)
        return { enabled: true, minChars: 0, debounceMs: 250 };

    return {
        enabled: source.search.enabled ?? true,
        minChars: source.search.minChars ?? 0,
        debounceMs: source.search.debounceMs ?? 250,
    };
};

const shouldAutoLoad = (layer: AtFormCascadeLayer) => {
    if (layer.source.type !== 'provider')
        return true;
    const search = sourceSearchConfig(layer.source);
    return !layer.source.loadOnOpen && (!search.enabled || search.minChars === 0);
};

const getRelationParentId = (item: AtEnumItemType, source: AtFormCascadeSource): AtEnumItemId | null | undefined => {
    if (source.type === 'provider')
        return undefined;

    const relation = source.relation ?? { type: 'parentId' as const };
    if (relation.type === 'parentId')
        return item.parentId;

    const raw = item.metadata?.[relation.key];
    return typeof raw === 'string' || typeof raw === 'number' || raw === null
        ? raw
        : undefined;
};

const matchesDeclarativeFilter = (item: AtEnumItemType, source: AtFormCascadeSource) => {
    if (source.type === 'provider' || !source.match?.metadata)
        return true;

    return Object.entries(source.match.metadata).every(([key, expected]) => {
        const actual = item.metadata?.[key];
        if (typeof expected === 'object' && expected !== null)
            return JSON.stringify(actual) === JSON.stringify(expected);
        return actual === expected;
    });
};

const normalizeProviderResult = (
    result: AtFormCascadeProviderResult | AtEnumType | null | undefined,
): FetchLayerResult => {
    if (Array.isArray(result))
        return { items: result, nextCursor: null, hasMore: false };

    const providerResult = result as AtFormCascadeProviderResult | null | undefined;
    return {
        items: providerResult?.items ?? [],
        nextCursor: providerResult?.nextCursor ?? null,
        hasMore: providerResult?.hasMore ?? Boolean(providerResult?.nextCursor),
    };
};

const mergeOptions = (base: AtEnumType, incoming: AtEnumType) => {
    const result = [...base];
    incoming.forEach((item) => {
        if (!result.some(existing => idsEqual(existing.id, item.id)))
            result.push(item);
    });
    return result;
};

const idSignature = (value: AtEnumItemId | null | undefined) => (
    value === null || value === undefined ? null : [typeof value, value]
);

const valueSignature = (
    mode: CascadeValueMode,
    value: AtEnumItemId | AtFormCascadePathValue | null | undefined,
    layers: AtFormCascadeLayer[],
) => {
    if (mode === 'scalar') {
        if (typeof value === 'object' && value !== null)
            return JSON.stringify(['scalar', 'invalid-object']);
        return JSON.stringify(['scalar', idSignature(value as AtEnumItemId | null | undefined)]);
    }

    const path = (value && typeof value === 'object') ? value as AtFormCascadePathValue : {};
    return JSON.stringify(['path', layers.map(layer => [layer.id, idSignature(path[layer.id])])]);
};

const buildInitialStates = (
    layers: AtFormCascadeLayer[],
    selections: Array<AtEnumItemType | null>,
) => {
    const active = getCascadeRouteActive(layers, selections);
    return layers.map((_, index) => emptyLayerState(!isCascadeLayerReady(layers, selections, active, index)));
};

const normalizeLeafSearchConfig = (leafSearch?: AtFormCascadeLeafSearch): AtFormCascadeLeafSearchConfig | null => {
    if (!leafSearch)
        return null;
    return leafSearch === true ? {} : leafSearch;
};

const getLeafSearchItemFromSelections = (
    layers: AtFormCascadeLayer[],
    selections: Array<AtEnumItemType | null>,
): AtFormCascadeLeafSearchItem | null => {
    const active = getCascadeRouteActive(layers, selections);
    const terminals = getCascadeActiveTerminalIndexes(layers, selections);
    const complete = active.every((isActive, index) => !isActive || Boolean(selections[index]));
    if (!complete || terminals.length !== 1 || !selections[terminals[0]])
        return null;

    return {
        terminalLayerId: layers[terminals[0]].id,
        path: toResolvedPath(layers, selections),
    };
};

const getLeafSearchItemText = (item: AtFormCascadeLeafSearchItem, layers: AtFormCascadeLayer[]) => {
    const titles = layers
        .map(layer => item.path[layer.id]?.title)
        .filter((title): title is string => Boolean(title));
    return [item.label, ...titles].filter(Boolean).join(' ').toLowerCase();
};

export const useCascadeEngine = ({ mode, value, layers, resolver, onPathChange, emitValue, leafSearch }: UseCascadeEngineProps) => {
    const { enums, cascadeProviders, cascadeResolvers, cascadeLeafSearchProviders } = useAtFormConfig();
    const configRef = useRef({ enums, cascadeProviders, cascadeResolvers, cascadeLeafSearchProviders });
    configRef.current = { enums, cascadeProviders, cascadeResolvers, cascadeLeafSearchProviders };
    const leafSearchConfig = useMemo(() => normalizeLeafSearchConfig(leafSearch), [leafSearch]);

    const valueRef = useRef(value);
    valueRef.current = value;
    const externalValueSignature = valueSignature(mode, value, layers);
    const localDataRevision = layers.some(layer => (
        layer.source.type === 'enum' || (layer.source.type !== 'provider' && Boolean(layer.source.filter))
    )) ? enums : null;

    const initialSelections = layers.map(() => null as AtEnumItemType | null);
    const [selections, setSelections] = useState<Array<AtEnumItemType | null>>(() => initialSelections);
    const [layerStates, setLayerStates] = useState<CascadeLayerState[]>(() => buildInitialStates(layers, initialSelections));
    const [leafSearchState, setLeafSearchState] = useState<CascadeLeafSearchState>({
        options: [],
        status: 'idle',
        error: null,
        query: '',
    });
    const selectionsRef = useRef(selections);
    const layerStatesRef = useRef(layerStates);
    const requestControllersRef = useRef<Array<AbortController | null>>([]);
    const requestIdsRef = useRef<number[]>([]);
    const searchTimersRef = useRef<Array<ReturnType<typeof setTimeout> | null>>([]);
    const hydrationControllerRef = useRef<AbortController | null>(null);
    const leafSearchControllerRef = useRef<AbortController | null>(null);
    const leafSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const localLeafIndexRef = useRef<AtFormCascadeLeafSearchItem[] | null>(null);
    const providerCacheRef = useRef<Map<string, FetchLayerResult>>(new Map());
    const lastEmittedSignatureRef = useRef<string | null>(null);
    const onPathChangeRef = useRef(onPathChange);

    onPathChangeRef.current = onPathChange;
    selectionsRef.current = selections;
    layerStatesRef.current = layerStates;

    const applySelections = useCallback((nextSelections: Array<AtEnumItemType | null>, notify = true) => {
        selectionsRef.current = nextSelections;
        setSelections(nextSelections);
        if (leafSearchConfig) {
            const leafItem = getLeafSearchItemFromSelections(layers, nextSelections);
            const terminal = leafItem ? leafItem.path[leafItem.terminalLayerId] : null;
            setLeafSearchState(current => ({
                ...current,
                query: terminal?.title ?? '',
                error: null,
            }));
        }
        if (notify)
            onPathChangeRef.current?.(toResolvedPath(layers, nextSelections));
    }, [layers, leafSearchConfig]);

    const applyLayerStates = useCallback((
        next: CascadeLayerState[] | ((current: CascadeLayerState[]) => CascadeLayerState[]),
    ) => {
        const resolved = typeof next === 'function' ? next(layerStatesRef.current) : next;
        layerStatesRef.current = resolved;
        setLayerStates(resolved);
    }, []);

    const resolveProvider = useCallback((source: AtFormCascadeProviderSource) => {
        if (typeof source.provider === 'function')
            return source.provider;
        return configRef.current.cascadeProviders?.[source.provider];
    }, []);

    const resolvePathResolver = useCallback((): AtFormCascadePathResolver | undefined => {
        if (typeof resolver === 'function')
            return resolver;
        if (typeof resolver === 'string') {
            const registered = configRef.current.cascadeResolvers?.[resolver];
            if (!registered)
                throw new Error(`Cascade resolver "${resolver}" is not registered.`);
            return registered;
        }
        return undefined;
    }, [resolver]);

    const resolveLeafSearchProvider = useCallback((): AtFormCascadeLeafSearchProvider | undefined => {
        const provider = leafSearchConfig?.provider;
        if (typeof provider === 'function')
            return provider;
        if (typeof provider === 'string') {
            const registered = configRef.current.cascadeLeafSearchProviders?.[provider];
            if (!registered)
                throw new Error(`Cascade leaf-search provider "${provider}" is not registered.`);
            return registered;
        }
        return undefined;
    }, [leafSearchConfig]);

    const fetchLayer = useCallback(async (
        layerIndex: number,
        path: AtFormCascadePathValue,
        query: string,
        cursor: string | null,
        signal: AbortSignal,
    ): Promise<FetchLayerResult> => {
        const layer = layers[layerIndex];
        if (!layer)
            return { items: [], nextCursor: null, hasMore: false };

        const source = layer.source;
        const dependencyIndex = getCascadeDependencyIndex(layers, layerIndex);
        const parentId = dependencyIndex === null ? null : path[layers[dependencyIndex].id] ?? null;
        if (dependencyIndex !== null && (parentId === null || parentId === undefined))
            return { items: [], nextCursor: null, hasMore: false };

        const contextIndexes = new Set(getCascadeDependencyAncestors(layers, layerIndex));
        getCascadeVisibilityConditions(layer).forEach((condition) => {
            const conditionIndex = layers.findIndex(candidate => candidate.id === condition.layerId);
            if (conditionIndex >= 0) {
                contextIndexes.add(conditionIndex);
                getCascadeDependencyAncestors(layers, conditionIndex).forEach(index => contextIndexes.add(index));
            }
        });
        const dependencyPath: AtFormCascadePathValue = Object.fromEntries(
            layers.map((pathLayer, index) => [pathLayer.id, contextIndexes.has(index) ? path[pathLayer.id] ?? null : null]),
        );

        if (source.type === 'provider') {
            const provider = resolveProvider(source);
            if (!provider) {
                const id = typeof source.provider === 'string' ? ` "${source.provider}"` : '';
                throw new Error(`Cascade provider${id} is not registered.`);
            }

            const pageSize = source.pageSize ?? 50;
            const providerIdentity = `${typeof source.provider === 'string' ? source.provider : 'inline'}:${getProviderFunctionId(provider)}`;
            const contextKey = layers.map(pathLayer => [pathLayer.id, idSignature(dependencyPath[pathLayer.id])]);
            const cacheKey = JSON.stringify([providerIdentity, layer.id, contextKey, query, cursor, pageSize]);
            if (source.cache !== false) {
                const cached = providerCacheRef.current.get(cacheKey);
                if (cached)
                    return cached;
            }

            const result = await provider({
                layer,
                layerIndex,
                parentId,
                path: dependencyPath,
                query,
                cursor,
                pageSize,
                signal,
            });

            const normalized = normalizeProviderResult(result);
            if (source.cache !== false) {
                providerCacheRef.current.set(cacheKey, normalized);
                if (providerCacheRef.current.size > 100) {
                    const oldestKey = providerCacheRef.current.keys().next().value;
                    if (oldestKey !== undefined)
                        providerCacheRef.current.delete(oldestKey);
                }
            }
            return normalized;
        }

        const currentEnums = configRef.current.enums;
        const sourceOptions = source.type === 'enum'
            ? currentEnums[source.enumKey ?? layer.id] ?? []
            : source.options ?? [];

        const related = sourceOptions.filter((option, optionIndex) => {
            if (!matchesDeclarativeFilter(option, source))
                return false;

            if (dependencyIndex !== null && !idsEqual(getRelationParentId(option, source), parentId))
                return false;

            if (source.filter && !source.filter({
                layer,
                layerIndex,
                option,
                optionIndex,
                path: dependencyPath,
                enums: currentEnums,
            }))
                return false;

            return true;
        });

        return { items: related, nextCursor: null, hasMore: false };
    }, [layers, resolveProvider]);

    const loadLayer = useCallback(async (
        layerIndex: number,
        options: { query?: string; cursor?: string | null; append?: boolean } = {},
    ) => {
        const layer = layers[layerIndex];
        if (!layer)
            return;

        const currentSelections = selectionsRef.current;
        const active = getCascadeRouteActive(layers, currentSelections);
        if (!isCascadeLayerReady(layers, currentSelections, active, layerIndex)) {
            applyLayerStates(previous => previous.map((state, index) => (
                index === layerIndex ? emptyLayerState(true) : state
            )));
            return;
        }

        const path = toPathValue(layers, currentSelections);
        const query = options.query ?? layerStatesRef.current[layerIndex]?.query ?? '';
        const cursor = options.cursor ?? null;
        const append = options.append ?? false;
        const source = layer.source;

        if (source.type === 'provider') {
            const search = sourceSearchConfig(source);
            if (search.enabled && query.trim().length < search.minChars) {
                const selected = currentSelections[layerIndex];
                applyLayerStates(previous => previous.map((state, index) => index === layerIndex ? {
                    ...state,
                    options: selected ? [selected] : [],
                    status: 'ready',
                    error: null,
                    query,
                    nextCursor: null,
                    hasMore: false,
                } : state));
                return;
            }
        }

        requestControllersRef.current[layerIndex]?.abort();
        const controller = new AbortController();
        requestControllersRef.current[layerIndex] = controller;
        const requestId = (requestIdsRef.current[layerIndex] ?? 0) + 1;
        requestIdsRef.current[layerIndex] = requestId;

        applyLayerStates(previous => previous.map((state, index) => index === layerIndex ? {
            ...state,
            status: append ? 'loadingMore' : 'loading',
            error: null,
            query,
        } : state));

        try {
            const result = await fetchLayer(layerIndex, path, query, cursor, controller.signal);
            if (controller.signal.aborted || requestIdsRef.current[layerIndex] !== requestId)
                return;

            const selected = selectionsRef.current[layerIndex];
            const seed = append ? layerStatesRef.current[layerIndex]?.options ?? [] : [];
            let nextOptions = mergeOptions(seed, result.items);
            if (selected)
                nextOptions = mergeOptions([selected], nextOptions);

            applyLayerStates(previous => previous.map((state, index) => index === layerIndex ? {
                ...state,
                options: nextOptions,
                status: 'ready',
                error: null,
                query,
                nextCursor: result.nextCursor,
                hasMore: result.hasMore,
            } : state));
        }
        catch (error) {
            if (controller.signal.aborted)
                return;

            const message = error instanceof Error ? error.message : 'Could not load options.';
            applyLayerStates(previous => previous.map((state, index) => index === layerIndex ? {
                ...state,
                status: 'error',
                error: message,
                nextCursor: null,
                hasMore: false,
            } : state));
        }
    }, [applyLayerStates, fetchLayer, layers]);

    const emitSelections = useCallback((nextSelections: Array<AtEnumItemType | null>) => {
        if (mode === 'scalar') {
            const active = getCascadeRouteActive(layers, nextSelections);
            const terminals = getCascadeActiveTerminalIndexes(layers, nextSelections);
            const complete = active.every((isActive, index) => !isActive || Boolean(nextSelections[index]));
            const terminal = terminals.length === 1 ? nextSelections[terminals[0]] : null;
            const nextValue = complete && terminal ? terminal.id : null;
            lastEmittedSignatureRef.current = valueSignature(mode, nextValue, layers);
            emitValue(nextValue);
            return;
        }

        const nextValue = toPathValue(layers, nextSelections);
        lastEmittedSignatureRef.current = valueSignature(mode, nextValue, layers);
        emitValue(nextValue);
    }, [emitValue, layers, mode]);

    const selectLayer = useCallback((layerIndex: number, selected: AtEnumItemType | null) => {
        const affected = getCascadeAffectedIndexes(layers, layerIndex);
        const nextSelections = selectionsRef.current.map((current, index) => {
            if (index === layerIndex)
                return selected;
            if (affected.has(index))
                return null;
            return current;
        });

        const routeActive = getCascadeRouteActive(layers, nextSelections);
        nextSelections.forEach((_, index) => {
            if (!routeActive[index])
                nextSelections[index] = null;
        });

        affected.forEach((index) => {
            if (index === layerIndex)
                return;
            requestControllersRef.current[index]?.abort();
            requestIdsRef.current[index] = (requestIdsRef.current[index] ?? 0) + 1;
            const timer = searchTimersRef.current[index];
            if (timer)
                clearTimeout(timer);
            searchTimersRef.current[index] = null;
        });

        applySelections(nextSelections);
        emitSelections(nextSelections);

        applyLayerStates(previous => previous.map((state, index) => {
            if (!affected.has(index) || index === layerIndex)
                return state;
            return emptyLayerState(!isCascadeLayerReady(layers, nextSelections, routeActive, index));
        }));

        queueMicrotask(() => {
            affected.forEach((index) => {
                if (index === layerIndex)
                    return;
                if (isCascadeLayerReady(layers, nextSelections, routeActive, index) && shouldAutoLoad(layers[index]))
                    void loadLayer(index);
            });
        });
    }, [applyLayerStates, applySelections, emitSelections, layers, loadLayer]);

    const openLayer = useCallback((layerIndex: number) => {
        const layer = layers[layerIndex];
        const state = layerStatesRef.current[layerIndex];
        const active = getCascadeRouteActive(layers, selectionsRef.current);
        if (!layer || !state || !isCascadeLayerReady(layers, selectionsRef.current, active, layerIndex))
            return;
        if (state.status === 'loading' || state.status === 'loadingMore')
            return;

        if (layer.source.type === 'provider') {
            const search = sourceSearchConfig(layer.source);
            if (search.enabled && state.query.trim().length < search.minChars)
                return;
        }

        if (state.status === 'idle' || state.error)
            void loadLayer(layerIndex, { query: state.query });
    }, [layers, loadLayer]);

    const searchLayer = useCallback((layerIndex: number, query: string) => {
        const layer = layers[layerIndex];
        if (!layer || layer.source.type !== 'provider')
            return;

        const search = sourceSearchConfig(layer.source);
        if (!search.enabled)
            return;

        requestControllersRef.current[layerIndex]?.abort();
        requestIdsRef.current[layerIndex] = (requestIdsRef.current[layerIndex] ?? 0) + 1;
        const currentTimer = searchTimersRef.current[layerIndex];
        if (currentTimer)
            clearTimeout(currentTimer);

        const selected = selectionsRef.current[layerIndex];
        const belowMinimum = query.trim().length < search.minChars;
        applyLayerStates(previous => previous.map((state, index) => index === layerIndex ? {
            ...state,
            options: selected ? [selected] : [],
            status: belowMinimum ? 'ready' : 'idle',
            error: null,
            query,
            nextCursor: null,
            hasMore: false,
        } : state));

        if (belowMinimum)
            return;

        searchTimersRef.current[layerIndex] = setTimeout(() => {
            searchTimersRef.current[layerIndex] = null;
            void loadLayer(layerIndex, { query });
        }, search.debounceMs);
    }, [applyLayerStates, layers, loadLayer]);

    const loadMore = useCallback((layerIndex: number) => {
        const state = layerStatesRef.current[layerIndex];
        if (!state?.hasMore || !state.nextCursor || state.status === 'loadingMore')
            return;

        void loadLayer(layerIndex, {
            query: state.query,
            cursor: state.nextCursor,
            append: true,
        });
    }, [loadLayer]);

    const retryLayer = useCallback((layerIndex: number) => {
        const state = layerStatesRef.current[layerIndex];
        void loadLayer(layerIndex, { query: state?.query ?? '' });
    }, [loadLayer]);

    const setHydrationError = useCallback((layerIndex: number, message: string) => {
        applyLayerStates(previous => previous.map((state, index) => index === layerIndex ? {
            ...state,
            status: 'error',
            error: message,
        } : state));
    }, [applyLayerStates]);

    const getLocalOptions = useCallback((layerIndex: number) => {
        const layer = layers[layerIndex];
        if (!layer || layer.source.type === 'provider')
            return null;
        return layer.source.type === 'enum'
            ? configRef.current.enums[layer.source.enumKey ?? layer.id] ?? []
            : layer.source.options;
    }, [layers]);

    const resolveLocalScalar = useCallback((scalarValue: AtEnumItemId): Array<AtEnumItemType | null> => {
        const candidates: Array<Array<AtEnumItemType | null>> = [];

        for (let terminalIndex = layers.length - 1; terminalIndex >= 0; terminalIndex -= 1) {
            const terminalLayer = layers[terminalIndex];
            const terminalOptions = getLocalOptions(terminalIndex);
            if (!terminalOptions)
                continue;

            const terminalItem = terminalOptions.find(item => idsEqual(item.id, scalarValue) && matchesDeclarativeFilter(item, terminalLayer.source));
            if (!terminalItem)
                continue;

            const resolved: Array<AtEnumItemType | null> = layers.map(() => null);
            resolved[terminalIndex] = terminalItem;
            let currentIndex = terminalIndex;
            let currentItem = terminalItem;
            let valid = true;

            while (valid) {
                const dependencyIndex = getCascadeDependencyIndex(layers, currentIndex);
                if (dependencyIndex === null)
                    break;

                const dependencyOptions = getLocalOptions(dependencyIndex);
                if (!dependencyOptions) {
                    valid = false;
                    break;
                }

                const parentId = getRelationParentId(currentItem, layers[currentIndex].source);
                if (parentId === null || parentId === undefined) {
                    valid = false;
                    break;
                }

                const parentItem = dependencyOptions.find(item => idsEqual(item.id, parentId) && matchesDeclarativeFilter(item, layers[dependencyIndex].source));
                if (!parentItem) {
                    valid = false;
                    break;
                }

                resolved[dependencyIndex] = parentItem;
                currentIndex = dependencyIndex;
                currentItem = parentItem;
            }

            if (!valid)
                continue;

            const activeTerminals = getCascadeActiveTerminalIndexes(layers, resolved);
            const active = getCascadeRouteActive(layers, resolved);
            const complete = active.every((isActive, index) => !isActive || Boolean(resolved[index]));
            if (complete && activeTerminals.length === 1 && activeTerminals[0] === terminalIndex)
                candidates.push(resolved);
        }

        if (candidates.length === 1)
            return candidates[0];
        if (candidates.length > 1)
            throw new Error(`Stored Cascade value "${String(scalarValue)}" resolves to more than one active route.`);
        if (layers.some(layer => layer.source.type === 'provider'))
            throw new Error('A resolver is required to hydrate this scalar Cascade value because its active route contains provider data.');
        throw new Error(`Could not resolve stored Cascade value "${String(scalarValue)}".`);
    }, [getLocalOptions, layers]);

    const hydrateResolvedSelections = useCallback(async (
        inputSelections: Array<AtEnumItemType | null>,
        signal: AbortSignal,
    ) => {
        const nextSelections = [...inputSelections];
        const routeActive = getCascadeRouteActive(layers, nextSelections);
        nextSelections.forEach((_, index) => {
            if (!routeActive[index])
                nextSelections[index] = null;
        });

        applySelections(nextSelections);
        const path = toPathValue(layers, nextSelections);
        const hydratedStates: CascadeLayerState[] = buildInitialStates(layers, nextSelections);

        for (let index = 0; index < layers.length; index += 1) {
            if (signal.aborted)
                return;
            if (!routeActive[index] || !isCascadeLayerReady(layers, nextSelections, routeActive, index))
                continue;

            const selected = nextSelections[index];
            const layer = layers[index];
            if (layer.source.type === 'provider') {
                hydratedStates[index] = {
                    ...hydratedStates[index],
                    options: selected ? [selected] : [],
                    status: 'idle',
                };
                continue;
            }

            const loaded = await fetchLayer(index, path, '', null, signal);
            if (selected && !loaded.items.some(item => idsEqual(item.id, selected.id)))
                throw new Error(`Stored value "${String(selected.id)}" is not valid for layer "${layer.id}" and its resolved dependency path.`);

            hydratedStates[index] = {
                ...hydratedStates[index],
                options: loaded.items,
                status: 'ready',
            };
        }

        if (signal.aborted)
            return;

        applyLayerStates(hydratedStates);
        queueMicrotask(() => {
            layers.forEach((layer, index) => {
                if (!routeActive[index] || nextSelections[index])
                    return;
                if (isCascadeLayerReady(layers, nextSelections, routeActive, index) && shouldAutoLoad(layer))
                    void loadLayer(index);
            });
        });
    }, [applyLayerStates, applySelections, fetchLayer, layers, loadLayer]);

    const hydrateFromResolver = useCallback(async (
        scalarValue: AtEnumItemId,
        pathResolver: AtFormCascadePathResolver,
        signal: AbortSignal,
    ) => {
        const resolved = await pathResolver({ value: scalarValue, layers, signal });
        if (signal.aborted)
            return;
        if (!resolved)
            throw new Error(`Resolver could not resolve Cascade value "${String(scalarValue)}".`);

        const nextSelections = layers.map(layer => resolved[layer.id] ?? null);
        const activeTerminals = getCascadeActiveTerminalIndexes(layers, nextSelections);
        const active = getCascadeRouteActive(layers, nextSelections);
        const complete = active.every((isActive, index) => !isActive || Boolean(nextSelections[index]));
        if (!complete)
            throw new Error('Resolver returned an incomplete active Cascade route.');
        if (activeTerminals.length !== 1)
            throw new Error('Scalar Cascade resolver must resolve exactly one active terminal route. Use CascadePathComboBox for fan-out branches.');

        const terminal = nextSelections[activeTerminals[0]];
        if (!terminal || !idsEqual(terminal.id, scalarValue))
            throw new Error(`Resolver path does not terminate at stored value "${String(scalarValue)}".`);

        await hydrateResolvedSelections(nextSelections, signal);
    }, [hydrateResolvedSelections, layers]);

    const clearAndLoadRoots = useCallback(() => {
        const cleared = layers.map(() => null as AtEnumItemType | null);
        applySelections(cleared);
        const states = buildInitialStates(layers, cleared);
        applyLayerStates(states);
        const active = getCascadeRouteActive(layers, cleared);
        queueMicrotask(() => {
            layers.forEach((layer, index) => {
                if (isCascadeLayerReady(layers, cleared, active, index) && shouldAutoLoad(layer))
                    void loadLayer(index);
            });
        });
    }, [applyLayerStates, applySelections, layers, loadLayer]);

    const buildLocalLeafIndex = useCallback(async (signal: AbortSignal) => {
        if (localLeafIndexRef.current)
            return localLeafIndexRef.current;
        if (layers.some(layer => layer.source.type === 'provider'))
            throw new Error('Provider-backed Cascade leaf search requires a leaf-search provider.');

        const results: AtFormCascadeLeafSearchItem[] = [];
        const walk = async (layerIndex: number, workingSelections: Array<AtEnumItemType | null>): Promise<void> => {
            if (signal.aborted)
                return;
            if (layerIndex >= layers.length) {
                const item = getLeafSearchItemFromSelections(layers, workingSelections);
                if (item)
                    results.push(item);
                return;
            }

            const active = getCascadeRouteActive(layers, workingSelections);
            if (!active[layerIndex]) {
                await walk(layerIndex + 1, workingSelections);
                return;
            }
            if (!isCascadeLayerReady(layers, workingSelections, active, layerIndex))
                return;

            const path = toPathValue(layers, workingSelections);
            const loaded = await fetchLayer(layerIndex, path, '', null, signal);
            for (const option of loaded.items) {
                if (signal.aborted)
                    return;
                const nextSelections = [...workingSelections];
                nextSelections[layerIndex] = option;
                await walk(layerIndex + 1, nextSelections);
            }
        };

        await walk(0, layers.map(() => null));
        if (!signal.aborted)
            localLeafIndexRef.current = results;
        return results;
    }, [fetchLayer, layers]);

    const loadLeafSearch = useCallback(async (query: string) => {
        if (!leafSearchConfig || mode !== 'scalar')
            return;

        leafSearchControllerRef.current?.abort();
        const controller = new AbortController();
        leafSearchControllerRef.current = controller;
        setLeafSearchState(current => ({ ...current, status: 'loading', error: null, query }));

        try {
            const limit = Math.max(1, leafSearchConfig.limit ?? 50);
            const provider = resolveLeafSearchProvider();
            let results: AtFormCascadeLeafSearchItem[];
            if (provider) {
                results = (await provider({ query, limit, layers, signal: controller.signal })) ?? [];
            }
            else {
                const index = await buildLocalLeafIndex(controller.signal);
                const normalized = query.trim().toLowerCase();
                results = index
                    .filter(item => !normalized || getLeafSearchItemText(item, layers).includes(normalized))
                    .slice(0, limit);
            }

            if (controller.signal.aborted)
                return;
            setLeafSearchState(current => ({
                ...current,
                options: results.slice(0, limit),
                status: 'ready',
                error: null,
                query,
            }));
        }
        catch (error) {
            if (controller.signal.aborted)
                return;
            setLeafSearchState(current => ({
                ...current,
                options: [],
                status: 'error',
                error: error instanceof Error ? error.message : 'Could not search Cascade leaves.',
                query,
            }));
        }
    }, [buildLocalLeafIndex, layers, leafSearchConfig, mode, resolveLeafSearchProvider]);

    const searchLeaves = useCallback((query: string) => {
        if (!leafSearchConfig || mode !== 'scalar')
            return;
        leafSearchControllerRef.current?.abort();
        if (leafSearchTimerRef.current)
            clearTimeout(leafSearchTimerRef.current);
        leafSearchTimerRef.current = null;

        const minChars = Math.max(0, leafSearchConfig.minChars ?? 0);
        const belowMinimum = query.trim().length < minChars;
        setLeafSearchState(current => ({
            ...current,
            options: belowMinimum ? [] : current.options,
            status: belowMinimum ? 'ready' : 'idle',
            error: null,
            query,
        }));
        if (belowMinimum)
            return;

        const debounceMs = Math.max(0, leafSearchConfig.debounceMs ?? 180);
        leafSearchTimerRef.current = setTimeout(() => {
            leafSearchTimerRef.current = null;
            void loadLeafSearch(query);
        }, debounceMs);
    }, [leafSearchConfig, loadLeafSearch, mode]);

    const openLeafSearch = useCallback(() => {
        if (!leafSearchConfig || mode !== 'scalar' || leafSearchState.status === 'loading')
            return;
        const minChars = Math.max(0, leafSearchConfig.minChars ?? 0);
        if (leafSearchState.query.trim().length < minChars)
            return;
        if (leafSearchState.status === 'idle' || leafSearchState.error)
            void loadLeafSearch(leafSearchState.query);
    }, [leafSearchConfig, leafSearchState.error, leafSearchState.query, leafSearchState.status, loadLeafSearch, mode]);

    const retryLeafSearch = useCallback(() => {
        if (leafSearchConfig && mode === 'scalar')
            void loadLeafSearch(leafSearchState.query);
    }, [leafSearchConfig, leafSearchState.query, loadLeafSearch, mode]);

    const selectLeafSearchItem = useCallback(async (item: AtFormCascadeLeafSearchItem | null) => {
        if (!leafSearchConfig || mode !== 'scalar')
            return;
        if (!item) {
            clearAndLoadRoots();
            emitSelections(layers.map(() => null));
            setLeafSearchState(current => ({ ...current, query: '', error: null }));
            return;
        }

        const terminalIndex = layers.findIndex(layer => layer.id === item.terminalLayerId);
        if (terminalIndex < 0) {
            setLeafSearchState(current => ({ ...current, status: 'error', error: `Leaf-search result references missing terminal layer "${item.terminalLayerId}".` }));
            return;
        }

        const nextSelections = layers.map(layer => item.path[layer.id] ?? null);
        const active = getCascadeRouteActive(layers, nextSelections);
        const terminals = getCascadeActiveTerminalIndexes(layers, nextSelections);
        const complete = active.every((isActive, index) => !isActive || Boolean(nextSelections[index]));
        if (!complete || terminals.length !== 1 || terminals[0] !== terminalIndex || !nextSelections[terminalIndex]) {
            setLeafSearchState(current => ({ ...current, status: 'error', error: 'Leaf-search result did not contain one complete scalar Cascade route.' }));
            return;
        }

        hydrationControllerRef.current?.abort();
        const controller = new AbortController();
        hydrationControllerRef.current = controller;
        try {
            await hydrateResolvedSelections(nextSelections, controller.signal);
            if (!controller.signal.aborted)
                emitSelections(nextSelections);
        }
        catch (error) {
            if (controller.signal.aborted)
                return;
            setLeafSearchState(current => ({
                ...current,
                status: 'error',
                error: error instanceof Error ? error.message : 'Could not select Cascade leaf.',
            }));
        }
    }, [clearAndLoadRoots, emitSelections, hydrateResolvedSelections, layers, leafSearchConfig, mode]);

    useEffect(() => {
        localLeafIndexRef.current = null;
    }, [layers, localDataRevision]);

    useEffect(() => {
        hydrationControllerRef.current?.abort();
        const controller = new AbortController();
        hydrationControllerRef.current = controller;

        const currentValue = valueRef.current;
        const signature = externalValueSignature;
        if (lastEmittedSignatureRef.current === signature)
            return () => controller.abort();

        lastEmittedSignatureRef.current = null;

        const hydrate = async () => {
            requestControllersRef.current.forEach(current => current?.abort());
            searchTimersRef.current.forEach((timer, index) => {
                if (timer)
                    clearTimeout(timer);
                searchTimersRef.current[index] = null;
            });

            try {
                if (mode === 'scalar') {
                    if (currentValue === null || currentValue === undefined || typeof currentValue === 'object') {
                        clearAndLoadRoots();
                        return;
                    }

                    const pathResolver = resolvePathResolver();
                    if (pathResolver)
                        await hydrateFromResolver(currentValue as AtEnumItemId, pathResolver, controller.signal);
                    else
                        await hydrateResolvedSelections(resolveLocalScalar(currentValue as AtEnumItemId), controller.signal);
                    return;
                }

                const pathValue = currentValue && typeof currentValue === 'object'
                    ? currentValue as AtFormCascadePathValue
                    : null;
                if (!pathValue) {
                    clearAndLoadRoots();
                    return;
                }

                const nextSelections: Array<AtEnumItemType | null> = layers.map(() => null);
                const nextStates: CascadeLayerState[] = buildInitialStates(layers, nextSelections);
                const workingPath: AtFormCascadePathValue = Object.fromEntries(layers.map(layer => [layer.id, null]));

                for (let index = 0; index < layers.length; index += 1) {
                    const routeActive = getCascadeRouteActive(layers, nextSelections);
                    if (!routeActive[index])
                        continue;

                    const desiredId = pathValue[layers[index].id];
                    if (desiredId === null || desiredId === undefined)
                        continue;

                    if (!isCascadeLayerReady(layers, nextSelections, routeActive, index))
                        continue;

                    const loaded = await fetchLayer(index, workingPath, '', null, controller.signal);
                    if (controller.signal.aborted)
                        return;

                    const found = loaded.items.find(item => idsEqual(item.id, desiredId));
                    if (!found) {
                        const placeholder = { id: desiredId, title: String(desiredId) };
                        nextSelections[index] = placeholder;
                        workingPath[layers[index].id] = desiredId;
                        nextStates[index] = {
                            ...nextStates[index],
                            options: [placeholder],
                            status: 'error',
                            error: `Could not resolve stored value "${String(desiredId)}". Configure a resolver/provider strategy that can load the stored item directly.`,
                        };
                    }
                    else {
                        nextSelections[index] = found;
                        workingPath[layers[index].id] = found.id;
                        nextStates[index] = {
                            ...nextStates[index],
                            options: mergeOptions([found], loaded.items),
                            status: 'ready',
                            nextCursor: loaded.nextCursor,
                            hasMore: loaded.hasMore,
                        };
                    }
                }

                const finalActive = getCascadeRouteActive(layers, nextSelections);
                nextSelections.forEach((_, index) => {
                    if (!finalActive[index])
                        nextSelections[index] = null;
                });
                applySelections(nextSelections);
                applyLayerStates(nextStates.map((state, index) => ({
                    ...state,
                    status: isCascadeLayerReady(layers, nextSelections, finalActive, index) ? state.status : 'blocked',
                })));
            }
            catch (error) {
                if (controller.signal.aborted)
                    return;
                const message = error instanceof Error ? error.message : 'Could not resolve Cascade value.';
                setHydrationError(Math.max(layers.length - 1, 0), message);
            }
        };

        void hydrate();
        return () => controller.abort();
    }, [
        applyLayerStates,
        applySelections,
        clearAndLoadRoots,
        externalValueSignature,
        fetchLayer,
        hydrateFromResolver,
        hydrateResolvedSelections,
        layers,
        localDataRevision,
        mode,
        resolveLocalScalar,
        resolvePathResolver,
        setHydrationError,
    ]);

    useEffect(() => () => {
        hydrationControllerRef.current?.abort();
        leafSearchControllerRef.current?.abort();
        if (leafSearchTimerRef.current)
            clearTimeout(leafSearchTimerRef.current);
        requestControllersRef.current.forEach(controller => controller?.abort());
        searchTimersRef.current.forEach(timer => timer && clearTimeout(timer));
    }, []);

    const pathValue = useMemo(() => toPathValue(layers, selections), [layers, selections]);
    const resolvedPath = useMemo(() => toResolvedPath(layers, selections), [layers, selections]);
    const leafSearchValue = useMemo(
        () => leafSearchConfig && mode === 'scalar' ? getLeafSearchItemFromSelections(layers, selections) : null,
        [layers, leafSearchConfig, mode, selections],
    );

    return {
        selections,
        layerStates,
        pathValue,
        resolvedPath,
        selectLayer,
        openLayer,
        searchLayer,
        loadMore,
        retryLayer,
        leafSearchState,
        leafSearchValue,
        searchLeaves,
        openLeafSearch,
        retryLeafSearch,
        selectLeafSearchItem,
    };
};
