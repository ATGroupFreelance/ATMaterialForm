import { AtEnumItemType } from '../../../../../types/Common.type';
import {
    AtFormCascadeLayer,
    AtFormCascadeLayerVisibilityCondition,
} from '../../../../../types/ui/CascadeComboBox.type';

export const getCascadeDependencyId = (
    layers: AtFormCascadeLayer[],
    layerIndex: number,
): string | null => {
    const layer = layers[layerIndex];
    if (!layer)
        return null;
    if (layer.dependsOn !== undefined)
        return layer.dependsOn;
    return layerIndex === 0 ? null : layers[layerIndex - 1]?.id ?? null;
};

export const getCascadeDependencyIndex = (
    layers: AtFormCascadeLayer[],
    layerIndex: number,
): number | null => {
    const dependencyId = getCascadeDependencyId(layers, layerIndex);
    if (dependencyId === null)
        return null;
    const index = layers.findIndex(layer => layer.id === dependencyId);
    return index >= 0 ? index : null;
};

const normalizeConditions = (layer: AtFormCascadeLayer): AtFormCascadeLayerVisibilityCondition[] => {
    if (!layer.visibleWhen)
        return [];
    return Array.isArray(layer.visibleWhen) ? layer.visibleWhen : [layer.visibleWhen];
};

export const getCascadeVisibilityConditions = normalizeConditions;

const matchesMetadata = (
    selection: AtEnumItemType,
    condition: AtFormCascadeLayerVisibilityCondition,
) => {
    if (!condition.match?.metadata)
        return true;

    return Object.entries(condition.match.metadata).every(([key, expected]) => {
        const actual = selection.metadata?.[key];
        if (typeof expected === 'object' && expected !== null)
            return JSON.stringify(actual) === JSON.stringify(expected);
        return actual === expected;
    });
};

const conditionMatches = (
    layers: AtFormCascadeLayer[],
    selections: Array<AtEnumItemType | null>,
    condition: AtFormCascadeLayerVisibilityCondition,
) => {
    const controlIndex = layers.findIndex(layer => layer.id === condition.layerId);
    if (controlIndex < 0)
        return false;

    const selection = selections[controlIndex];
    if (!selection)
        return false;

    if (condition.ids && !condition.ids.some(id => id === selection.id))
        return false;

    return matchesMetadata(selection, condition);
};

/**
 * Returns which configured layers belong to the currently selected route.
 * Dependency existence is structural; selecting a dependency controls whether
 * a route-active layer is ready/visible, not whether it belongs to the route.
 */
export const getCascadeRouteActive = (
    layers: AtFormCascadeLayer[],
    selections: Array<AtEnumItemType | null>,
): boolean[] => {
    const active = layers.map(() => false);

    layers.forEach((layer, index) => {
        const dependencyIndex = getCascadeDependencyIndex(layers, index);
        const dependencyActive = dependencyIndex === null || (dependencyIndex < index && active[dependencyIndex]);
        if (!dependencyActive)
            return;

        active[index] = normalizeConditions(layer).every(condition => conditionMatches(layers, selections, condition));
    });

    return active;
};

export const isCascadeLayerReady = (
    layers: AtFormCascadeLayer[],
    selections: Array<AtEnumItemType | null>,
    routeActive: boolean[],
    layerIndex: number,
) => {
    if (!routeActive[layerIndex])
        return false;
    const dependencyIndex = getCascadeDependencyIndex(layers, layerIndex);
    return dependencyIndex === null || Boolean(selections[dependencyIndex]);
};

export const getCascadeDisplayActive = (
    layers: AtFormCascadeLayer[],
    selections: Array<AtEnumItemType | null>,
    reveal: 'all' | 'progressive' = 'all',
): boolean[] => {
    const routeActive = getCascadeRouteActive(layers, selections);
    if (reveal === 'all')
        return routeActive;
    return routeActive.map((active, index) => active && isCascadeLayerReady(layers, selections, routeActive, index));
};

export const getCascadeDependencyAncestors = (
    layers: AtFormCascadeLayer[],
    layerIndex: number,
): number[] => {
    const result: number[] = [];
    const visited = new Set<number>();
    let current = getCascadeDependencyIndex(layers, layerIndex);

    while (current !== null && current >= 0 && !visited.has(current)) {
        visited.add(current);
        result.unshift(current);
        current = getCascadeDependencyIndex(layers, current);
    }

    return result;
};

export const getCascadeAffectedIndexes = (
    layers: AtFormCascadeLayer[],
    changedIndex: number,
): Set<number> => {
    const affected = new Set<number>([changedIndex]);
    let changed = true;

    while (changed) {
        changed = false;
        layers.forEach((layer, index) => {
            if (affected.has(index))
                return;

            const dependencyIndex = getCascadeDependencyIndex(layers, index);
            const conditionIndexes = normalizeConditions(layer)
                .map(condition => layers.findIndex(candidate => candidate.id === condition.layerId))
                .filter(conditionIndex => conditionIndex >= 0);

            if ((dependencyIndex !== null && affected.has(dependencyIndex)) || conditionIndexes.some(i => affected.has(i))) {
                affected.add(index);
                changed = true;
            }
        });
    }

    return affected;
};

export const getCascadeActiveTerminalIndexes = (
    layers: AtFormCascadeLayer[],
    selections: Array<AtEnumItemType | null>,
): number[] => {
    const active = getCascadeRouteActive(layers, selections);
    return layers
        .map((_, index) => index)
        .filter(index => active[index])
        .filter(index => !layers.some((_, childIndex) => (
            childIndex !== index
            && active[childIndex]
            && getCascadeDependencyIndex(layers, childIndex) === index
        )));
};
