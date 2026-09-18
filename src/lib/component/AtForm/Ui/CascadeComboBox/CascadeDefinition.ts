import { AtFormCascadeLayer, AtFormCascadeLeafSearch, AtFormCascadeLeafSearchConfig, AtFormCascadePathResolver } from '../../../../types/ui/CascadeComboBox.type';
import { getCascadeDependencyId, getCascadeVisibilityConditions } from './internal/CascadeStructure';

export type AtFormCascadeDefinitionIssueSeverity = 'error' | 'warning';

export interface AtFormCascadeDefinitionIssue {
    severity: AtFormCascadeDefinitionIssueSeverity;
    code: string;
    message: string;
    layerId?: string;
}

interface ValidateCascadeDefinitionParams {
    layers: AtFormCascadeLayer[];
    mode?: 'scalar' | 'path';
    resolver?: AtFormCascadePathResolver | string;
    leafSearch?: AtFormCascadeLeafSearch;
}

/**
 * Serializable-definition validation intended for Form Maker/property panels.
 * Runtime provider availability is intentionally not checked here because the
 * provider registry belongs to the host application.
 */
export const validateCascadeDefinition = ({
    layers,
    mode = 'scalar',
    resolver,
    leafSearch,
}: ValidateCascadeDefinitionParams): AtFormCascadeDefinitionIssue[] => {
    const issues: AtFormCascadeDefinitionIssue[] = [];

    if (layers.length === 0) {
        issues.push({
            severity: 'error',
            code: 'layers.empty',
            message: 'Cascade requires at least one layer.',
        });
        return issues;
    }

    const ids = new Set<string>();
    layers.forEach((layer, layerIndex) => {
        if (!layer.id.trim()) {
            issues.push({
                severity: 'error',
                code: 'layer.id.empty',
                message: `Layer ${layerIndex + 1} requires an id.`,
            });
        }
        else if (ids.has(layer.id)) {
            issues.push({
                severity: 'error',
                code: 'layer.id.duplicate',
                layerId: layer.id,
                message: `Layer id "${layer.id}" is duplicated. Layer ids must be unique.`,
            });
        }
        ids.add(layer.id);

        if (layer.minWidth !== undefined && (!Number.isFinite(layer.minWidth) || layer.minWidth <= 0)) {
            issues.push({
                severity: 'error',
                code: 'layer.minWidth.invalid',
                layerId: layer.id,
                message: `Layer "${layer.id}" minWidth must be greater than zero.`,
            });
        }

        const dependencyId = getCascadeDependencyId(layers, layerIndex);
        if (dependencyId !== null) {
            const dependencyIndex = layers.findIndex(candidate => candidate.id === dependencyId);
            if (dependencyIndex < 0) {
                issues.push({
                    severity: 'error',
                    code: 'layer.dependsOn.missing',
                    layerId: layer.id,
                    message: `Layer "${layer.id}" depends on missing layer "${dependencyId}".`,
                });
            }
            else if (dependencyIndex >= layerIndex) {
                issues.push({
                    severity: 'error',
                    code: 'layer.dependsOn.order',
                    layerId: layer.id,
                    message: `Layer "${layer.id}" must depend on an earlier layer.`,
                });
            }
        }

        getCascadeVisibilityConditions(layer).forEach((condition) => {
            const conditionIndex = layers.findIndex(candidate => candidate.id === condition.layerId);
            if (conditionIndex < 0) {
                issues.push({
                    severity: 'error',
                    code: 'layer.visibleWhen.missing',
                    layerId: layer.id,
                    message: `Layer "${layer.id}" references missing visibility layer "${condition.layerId}".`,
                });
            }
            else if (conditionIndex >= layerIndex) {
                issues.push({
                    severity: 'error',
                    code: 'layer.visibleWhen.order',
                    layerId: layer.id,
                    message: `Layer "${layer.id}" visibility must depend on an earlier layer.`,
                });
            }
        });

        const source = layer.source;
        if (source.type === 'provider') {
            if (typeof source.provider === 'string' && !source.provider.trim()) {
                issues.push({
                    severity: 'error',
                    code: 'provider.id.empty',
                    layerId: layer.id,
                    message: `Layer "${layer.id}" requires a provider id or provider function.`,
                });
            }
            if (source.pageSize !== undefined && (!Number.isInteger(source.pageSize) || source.pageSize <= 0)) {
                issues.push({
                    severity: 'error',
                    code: 'provider.pageSize.invalid',
                    layerId: layer.id,
                    message: `Layer "${layer.id}" pageSize must be a positive integer.`,
                });
            }
            if (source.search && source.search !== true && (!Number.isInteger(source.search.minChars ?? 0) || (source.search.minChars ?? 0) < 0)) {
                issues.push({
                    severity: 'error',
                    code: 'provider.search.minChars.invalid',
                    layerId: layer.id,
                    message: `Layer "${layer.id}" search minChars must be a non-negative integer.`,
                });
            }
            if (source.search && source.search !== true && (!Number.isFinite(source.search.debounceMs ?? 0) || (source.search.debounceMs ?? 0) < 0)) {
                issues.push({
                    severity: 'error',
                    code: 'provider.search.debounce.invalid',
                    layerId: layer.id,
                    message: `Layer "${layer.id}" search debounceMs cannot be negative.`,
                });
            }
            return;
        }

        if (source.relation?.type === 'metadata' && !source.relation.key.trim()) {
            issues.push({
                severity: 'error',
                code: 'relation.metadataKey.empty',
                layerId: layer.id,
                message: `Layer "${layer.id}" requires a metadata relation key.`,
            });
        }

        if (source.type === 'static') {
            const optionIds = new Set<string>();
            source.options.forEach((option) => {
                const optionId = `${typeof option.id}:${String(option.id)}`;
                if (optionIds.has(optionId)) {
                    issues.push({
                        severity: 'error',
                        code: 'static.optionId.duplicate',
                        layerId: layer.id,
                        message: `Layer "${layer.id}" contains duplicate option id "${String(option.id)}".`,
                    });
                }
                optionIds.add(optionId);
            });
        }
    });

    if (mode === 'scalar' && !resolver && layers.some(layer => layer.source.type === 'provider')) {
        issues.push({
            severity: 'warning',
            code: 'scalar.remoteResolver.missing',
            message: 'Provider-backed scalar Cascade can be selected normally, but loading an existing leaf id requires a resolver.',
        });
    }

    if (leafSearch) {
        const config: AtFormCascadeLeafSearchConfig = leafSearch === true ? {} : leafSearch;
        if (mode !== 'scalar') {
            issues.push({
                severity: 'error',
                code: 'leafSearch.pathMode.unsupported',
                message: 'Whole-tree leaf search represents one terminal selection and is supported only by scalar CascadeComboBox.',
            });
        }
        if (typeof config.provider === 'string' && !config.provider.trim()) {
            issues.push({
                severity: 'error',
                code: 'leafSearch.provider.empty',
                message: 'Cascade leaf search provider id cannot be empty.',
            });
        }
        if (!config.provider && layers.some(layer => layer.source.type === 'provider')) {
            issues.push({
                severity: 'error',
                code: 'leafSearch.remoteProvider.missing',
                message: 'Provider-backed Cascade requires a leaf-search provider to search the whole tree without enumerating remote data.',
            });
        }
        if (config.minChars !== undefined && (!Number.isInteger(config.minChars) || config.minChars < 0)) {
            issues.push({
                severity: 'error',
                code: 'leafSearch.minChars.invalid',
                message: 'Cascade leaf search minChars must be a non-negative integer.',
            });
        }
        if (config.debounceMs !== undefined && (!Number.isFinite(config.debounceMs) || config.debounceMs < 0)) {
            issues.push({
                severity: 'error',
                code: 'leafSearch.debounce.invalid',
                message: 'Cascade leaf search debounceMs cannot be negative.',
            });
        }
        if (config.limit !== undefined && (!Number.isInteger(config.limit) || config.limit <= 0)) {
            issues.push({
                severity: 'error',
                code: 'leafSearch.limit.invalid',
                message: 'Cascade leaf search limit must be a positive integer.',
            });
        }
    }

    if (mode === 'scalar') {
        const unconditionalChildren = new Map<string, string[]>();
        layers.forEach((layer, index) => {
            const dependencyId = getCascadeDependencyId(layers, index);
            if (dependencyId === null || getCascadeVisibilityConditions(layer).length > 0)
                return;
            unconditionalChildren.set(dependencyId, [...(unconditionalChildren.get(dependencyId) ?? []), layer.id]);
        });
        unconditionalChildren.forEach((children, dependencyId) => {
            if (children.length > 1) {
                issues.push({
                    severity: 'error',
                    code: 'scalar.branching.unconditional',
                    layerId: dependencyId,
                    message: `Scalar Cascade cannot have simultaneous leaf branches (${children.join(', ')}). Use mutually exclusive visibleWhen routes or CascadePathComboBox.`,
                });
            }
        });
    }

    return issues;
};
