import { AtJsonValue } from "at-shared-types/domain";
import {
    AtEnumItemId,
    AtEnumItemType,
    AtEnumsType,
    AtEnumType,
    AtFormMinimalControlledUiProps,
    StrictOmit,
} from "../Common.type";
import { AtFormComboBoxProps } from "./ComboBox.type";

export type AtFormCascadePathValue = Record<string, AtEnumItemId | null>;
export type AtFormCascadeResolvedPath = Record<string, AtEnumItemType | null>;

export interface AtFormCascadeLeafSearchItem {
    /** Resolved selections for the route represented by this searchable leaf. */
    path: AtFormCascadeResolvedPath;
    /** Active terminal layer for this result. */
    terminalLayerId: string;
    /** Optional display override. The renderer otherwise uses the terminal option title. */
    label?: string;
}

export interface AtFormCascadeLeafSearchContext {
    query: string;
    limit: number;
    layers: AtFormCascadeLayer[];
    signal: AbortSignal;
}

export type AtFormCascadeLeafSearchProviderValue =
    | AtFormCascadeLeafSearchItem[]
    | null
    | undefined;

export type AtFormCascadeLeafSearchProvider = (
    context: AtFormCascadeLeafSearchContext,
) => Promise<AtFormCascadeLeafSearchProviderValue> | AtFormCascadeLeafSearchProviderValue;

export interface AtFormCascadeLeafSearchConfig {
    /**
     * Omit for a fully local enum/static cascade. Provider-backed cascades
     * should supply a provider function or a registered provider id.
     */
    provider?: AtFormCascadeLeafSearchProvider | string;
    /** Minimum characters before searching. Defaults to 0. */
    minChars?: number;
    /** Delay before a search starts. Defaults to 180ms. */
    debounceMs?: number;
    /** Maximum result count requested/displayed. Defaults to 50. */
    limit?: number;
    /** Search field label. Defaults to `Search <cascade label>` when available. */
    label?: string;
    placeholder?: string;
}

export type AtFormCascadeLeafSearch = boolean | AtFormCascadeLeafSearchConfig;

export type AtFormCascadeRelation =
    | { type: 'parentId' }
    | { type: 'metadata'; key: string };

export interface AtFormCascadeMatch {
    metadata?: Record<string, AtJsonValue>;
}

export interface AtFormCascadeLayerVisibilityCondition {
    /** Earlier layer whose selected option controls whether this layer exists in the active route. */
    layerId: string;
    /** Optional typed ids accepted for the controlling layer. Omit to match any selected value. */
    ids?: AtEnumItemId[];
    /** Optional metadata match against the controlling layer's selected option. */
    match?: AtFormCascadeMatch;
}

export interface AtFormCascadeLocalFilterParams {
    layer: AtFormCascadeLayer;
    layerIndex: number;
    option: AtEnumItemType;
    optionIndex: number;
    /** Ancestor ids for the option being filtered; current/descendant ids are null. */
    path: AtFormCascadePathValue;
    enums: AtEnumsType;
}

export type AtFormCascadeLocalFilter = (params: AtFormCascadeLocalFilterParams) => boolean;

interface AtFormCascadeLocalSourceBase {
    /**
     * Relationship from this layer's records to the immediately previous layer.
     * Child layers default to the canonical `parentId` relationship.
     */
    relation?: AtFormCascadeRelation;
    /** Declarative, serializable filtering intended for Form Maker definitions. */
    match?: AtFormCascadeMatch;
    /** Runtime-only programmatic filtering. Do not persist this in Form Maker JSON. */
    filter?: AtFormCascadeLocalFilter;
}

export interface AtFormCascadeEnumSource extends AtFormCascadeLocalSourceBase {
    type: 'enum';
    /** Defaults to the layer id when omitted. */
    enumKey?: string;
}

export interface AtFormCascadeStaticSource extends AtFormCascadeLocalSourceBase {
    type: 'static';
    options: AtEnumType;
}

export interface AtFormCascadeProviderContext {
    layer: AtFormCascadeLayer;
    layerIndex: number;
    parentId: AtEnumItemId | null;
    /** Ancestor ids for this load; the current and descendant layer ids are null. */
    path: AtFormCascadePathValue;
    query: string;
    cursor: string | null;
    pageSize: number;
    signal: AbortSignal;
}

export interface AtFormCascadeProviderResult {
    items: AtEnumType;
    nextCursor?: string | null;
    hasMore?: boolean;
}

export type AtFormCascadeProviderValue = AtFormCascadeProviderResult | AtEnumType | null | undefined;

export type AtFormCascadeProvider = (
    context: AtFormCascadeProviderContext,
) => Promise<AtFormCascadeProviderValue> | AtFormCascadeProviderValue;

export interface AtFormCascadeProviderSearchConfig {
    enabled?: boolean;
    minChars?: number;
    debounceMs?: number;
}

export interface AtFormCascadeProviderSource {
    type: 'provider';
    /**
     * Direct functions are convenient for hand-written forms. String ids are
     * resolved through AtFormConfigProvider.cascadeProviders and are suitable
     * for persisted Form Maker definitions.
     */
    provider: AtFormCascadeProvider | string;
    pageSize?: number;
    /** Cache successful pages by provider/layer/ancestor/search/cursor. Defaults to true. */
    cache?: boolean;
    loadOnOpen?: boolean;
    search?: boolean | AtFormCascadeProviderSearchConfig;
}

export type AtFormCascadeSource =
    | AtFormCascadeEnumSource
    | AtFormCascadeStaticSource
    | AtFormCascadeProviderSource;

export interface AtFormCascadeLayer {
    id: string;
    label?: string;
    /**
     * Data dependency for this layer. Omit for the normal linear behavior
     * (the previous declared layer); use null for an independent root.
     * Multiple layers may depend on the same parent in path-valued cascades.
     */
    dependsOn?: string | null;
    /**
     * Declarative route conditions. Every condition must match for the layer
     * to participate in the active route. This enables variable-depth paths.
     */
    visibleWhen?: AtFormCascadeLayerVisibilityCondition | AtFormCascadeLayerVisibilityCondition[];
    source: AtFormCascadeSource;
    readOnly?: boolean;
    minWidth?: number;
    uiProps?: StrictOmit<
        AtFormComboBoxProps,
        'id' | 'value' | 'onChange' | 'multiple' | 'readOnly' | 'options' | 'enumsKey' | 'label' |
        'freeSolo' | 'loading' | 'filterOptions' | 'getOptionLabel' | 'isOptionEqualToValue' | 'onOpen' | 'onInputChange'
    >;
}

export interface AtFormCascadeResolvePathContext {
    value: AtEnumItemId;
    layers: AtFormCascadeLayer[];
    signal: AbortSignal;
}

export type AtFormCascadePathResolverValue = AtFormCascadeResolvedPath | null | undefined;

export type AtFormCascadePathResolver = (
    context: AtFormCascadeResolvePathContext,
) => Promise<AtFormCascadePathResolverValue> | AtFormCascadePathResolverValue;

export interface AtFormCascadePresentation {
    /**
     * Draw an internal visual boundary around the compound field. Defaults to false.
     * Prefer ATForm Layouts for normal form-level grouping; enable this for standalone use.
     */
    grouped?: boolean;
    /** Show the currently resolved path above the controls. Defaults to true. */
    showPath?: boolean;
    /** Default minimum width for each internal layer before wrapping. */
    minColumnWidth?: number;
    /**
     * `all` keeps inactive descendants visible/disabled. `progressive` only
     * reveals a layer once its route conditions match and its dependency is selected.
     */
    reveal?: 'all' | 'progressive';
}

export interface AtFormCascadeBaseProps
    extends Omit<AtFormMinimalControlledUiProps, 'value' | 'onChange'> {
    /** Version marker for persisted Form Maker definitions. */
    schemaVersion?: 2;
    label?: string;
    layers: AtFormCascadeLayer[];
    /**
     * Required for scalar remote hydration unless every layer can be resolved
     * locally. String ids resolve through AtFormConfigProvider.cascadeResolvers.
     */
    resolver?: AtFormCascadePathResolver | string;
    presentation?: AtFormCascadePresentation;
    onPathChange?: (path: AtFormCascadeResolvedPath) => void;
}

export interface AtFormCascadeComboBoxProps extends AtFormCascadeBaseProps {
    /**
     * Optional whole-tree terminal search. Disabled by default. This belongs to
     * scalar Cascade because one search selection maps to exactly one terminal id.
     */
    leafSearch?: AtFormCascadeLeafSearch;
    value?: AtEnumItemId | null;
    onChange?: (event: { target: { value: AtEnumItemId | null } }) => void;
}

export interface AtFormCascadePathComboBoxProps extends AtFormCascadeBaseProps {
    value?: AtFormCascadePathValue | null;
    onChange?: (event: { target: { value: AtFormCascadePathValue | null } }) => void;
}
