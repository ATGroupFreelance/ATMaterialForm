import React from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
    Autocomplete,
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    FormHelperText,
    TextField,
    Typography,
} from '@mui/material';

import useAtFormConfig from '../../../../../hooks/useAtFormConfig/useAtFormConfig';
import { resolveEnumItemDisplayTitle } from '../../../../../enum/resolveEnumItemDisplayTitle';
import { AtEnumItemType } from '../../../../../types/Common.type';
import {
    AtFormCascadeLayer,
    AtFormCascadeLeafSearch,
    AtFormCascadeLeafSearchConfig,
    AtFormCascadeLeafSearchItem,
    AtFormCascadePresentation,
} from '../../../../../types/ui/CascadeComboBox.type';
import { CascadeLayerState, CascadeLeafSearchState } from './useCascadeEngine';
import { getCascadeDisplayActive, getCascadeRouteActive } from './CascadeStructure';

interface CascadeRendererProps {
    id?: string;
    label?: string;
    layers: AtFormCascadeLayer[];
    selections: Array<AtEnumItemType | null>;
    layerStates: CascadeLayerState[];
    presentation?: AtFormCascadePresentation;
    leafSearch?: AtFormCascadeLeafSearch;
    leafSearchState?: CascadeLeafSearchState;
    leafSearchValue?: AtFormCascadeLeafSearchItem | null;
    onLeafSearch?: (query: string) => void;
    onLeafSearchOpen?: () => void;
    onLeafSearchRetry?: () => void;
    onLeafSearchSelect?: (item: AtFormCascadeLeafSearchItem | null) => void;
    readOnly?: boolean;
    error?: boolean;
    helperText?: string;
    onSelect: (layerIndex: number, value: AtEnumItemType | null) => void;
    onOpen: (layerIndex: number) => void;
    onSearch: (layerIndex: number, query: string) => void;
    onLoadMore: (layerIndex: number) => void;
    onRetry: (layerIndex: number) => void;
}

const isProviderLayer = (layer: AtFormCascadeLayer) => layer.source.type === 'provider';

const providerMinChars = (layer: AtFormCascadeLayer) => {
    if (layer.source.type !== 'provider' || !layer.source.search)
        return 0;
    if (layer.source.search === true || layer.source.search.enabled === false)
        return 0;
    return layer.source.search.minChars ?? 0;
};

const CascadeRenderer = ({
    id,
    label,
    layers,
    selections,
    layerStates,
    presentation,
    leafSearch,
    leafSearchState,
    leafSearchValue,
    onLeafSearch,
    onLeafSearchOpen,
    onLeafSearchRetry,
    onLeafSearchSelect,
    readOnly,
    error,
    helperText,
    onSelect,
    onOpen,
    onSearch,
    onLoadMore,
    onRetry,
}: CascadeRendererProps) => {
    const { t } = useAtFormConfig();
    const grouped = presentation?.grouped ?? false;
    const showPath = presentation?.showPath ?? true;
    const minColumnWidth = presentation?.minColumnWidth ?? 220;
    const helperId = id ? `${id}-helper-text` : undefined;
    const routeActive = getCascadeRouteActive(layers, selections);
    const displayActive = getCascadeDisplayActive(layers, selections, presentation?.reveal ?? 'all');
    const selectedItems = layers
        .map((layer, index) => ({ layer, item: selections[index], index }))
        .filter((entry): entry is { layer: AtFormCascadeLayer; item: AtEnumItemType; index: number } => (
            routeActive[entry.index] && Boolean(entry.item)
        ));
    const leafSearchConfig: AtFormCascadeLeafSearchConfig = leafSearch && leafSearch !== true ? leafSearch : {};
    const leafSearchEnabled = Boolean(leafSearch && leafSearchState && onLeafSearch && onLeafSearchSelect);
    const leafSearchMinChars = leafSearchConfig.minChars ?? 0;
    const leafSearchLoading = leafSearchState?.status === 'loading';

    const resolveLayerItemTitle = (layer: AtFormCascadeLayer, item: AtEnumItemType) => {
        const enumKey = layer.source.type === 'enum'
            ? layer.source.enumKey ?? layer.id
            : undefined;
        return resolveEnumItemDisplayTitle({ enumKey, item, t });
    };

    const getLeafSearchTerminal = (item: AtFormCascadeLeafSearchItem) => {
        const layer = layers.find(candidate => candidate.id === item.terminalLayerId);
        const terminal = item.path[item.terminalLayerId];
        return layer && terminal ? { layer, terminal } : null;
    };

    const getLeafSearchLabel = (item: AtFormCascadeLeafSearchItem) => {
        if (item.label)
            return item.label;
        const terminal = getLeafSearchTerminal(item);
        return terminal ? resolveLayerItemTitle(terminal.layer, terminal.terminal) : '';
    };

    const getLeafSearchPath = (item: AtFormCascadeLeafSearchItem) => layers
        .map(layer => {
            const pathItem = item.path[layer.id];
            return pathItem ? resolveLayerItemTitle(layer, pathItem) : null;
        })
        .filter((title): title is string => Boolean(title));

    return (
        <Box
            component="fieldset"
            aria-describedby={helperId}
            sx={(theme) => ({
                m: 0,
                minWidth: 0,
                width: '100%',
                border: grouped ? `1px solid ${error ? theme.palette.error.main : theme.palette.divider}` : 0,
                borderRadius: grouped ? 2 : 0,
                px: grouped ? 2 : 0,
                pt: grouped ? 1.25 : 0,
                pb: grouped ? 2 : 0,
            })}
        >
            {label && (
                <Typography
                    component="legend"
                    variant="subtitle2"
                    sx={{ px: grouped ? 0.75 : 0, fontWeight: 600 }}
                >
                    {label}
                </Typography>
            )}

            {leafSearchEnabled && (
                <Box sx={{ mb: showPath && selectedItems.length > 0 ? 1.25 : 2, maxWidth: 680 }}>
                    <Autocomplete
                        id={id ? `${id}-leaf-search` : 'cascade-leaf-search'}
                        options={leafSearchState?.options ?? []}
                        value={leafSearchValue ?? null}
                        inputValue={leafSearchState?.query ?? ''}
                        disabled={readOnly}
                        loading={leafSearchLoading}
                        filterOptions={(options) => options}
                        onOpen={onLeafSearchOpen}
                        onInputChange={(_event, inputValue, reason) => {
                            if (reason === 'input' || reason === 'clear')
                                onLeafSearch?.(inputValue);
                        }}
                        onChange={(_event, nextValue) => onLeafSearchSelect?.(nextValue)}
                        getOptionLabel={getLeafSearchLabel}
                        isOptionEqualToValue={(option, optionValue) => {
                            if (option.terminalLayerId !== optionValue.terminalLayerId)
                                return false;
                            return option.path[option.terminalLayerId]?.id === optionValue.path[optionValue.terminalLayerId]?.id;
                        }}
                        noOptionsText={
                            (leafSearchState?.query.trim().length ?? 0) < leafSearchMinChars
                                ? t(`Type at least ${leafSearchMinChars} characters to search.`, `Type at least ${leafSearchMinChars} characters to search.`)
                                : t('No matching leaves.', 'No matching leaves.')
                        }
                        renderOption={(optionProps, option) => {
                            const { key, ...restOptionProps } = optionProps as typeof optionProps & { key?: React.Key };
                            const pathTitles = getLeafSearchPath(option);
                            return (
                                <Box
                                    component="li"
                                    key={key ?? `${option.terminalLayerId}-${String(option.path[option.terminalLayerId]?.id)}`}
                                    {...restOptionProps}
                                    sx={{ display: 'block !important', py: 1 }}
                                >
                                    <Typography variant="body2" fontWeight={600}>
                                        {getLeafSearchLabel(option)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {pathTitles.join(' › ')}
                                    </Typography>
                                </Box>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={leafSearchConfig.label ?? (label ? `${t('Search', 'Search')} ${label}` : t('Search cascade', 'Search cascade'))}
                                placeholder={leafSearchConfig.placeholder}
                                error={leafSearchState?.status === 'error'}
                                helperText={
                                    leafSearchState?.error
                                    ?? (leafSearchMinChars > 0 && (leafSearchState?.query.trim().length ?? 0) < leafSearchMinChars
                                        ? t(`Search any final option by typing at least ${leafSearchMinChars} characters.`, `Search any final option by typing at least ${leafSearchMinChars} characters.`)
                                        : t('Search a final option to fill the full cascade path.', 'Search a final option to fill the full cascade path.'))
                                }
                                slotProps={{
                                    ...params.slotProps,
                                    input: {
                                        ...params.slotProps.input,
                                        startAdornment: (
                                            <>
                                                <SearchRoundedIcon fontSize="small" sx={{ mr: 0.75, color: 'text.secondary' }} />
                                                {params.slotProps.input?.startAdornment}
                                            </>
                                        ),
                                        endAdornment: (
                                            <>
                                                {leafSearchLoading && <CircularProgress color="inherit" size={18} />}
                                                {params.slotProps.input?.endAdornment}
                                            </>
                                        ),
                                    },
                                }}
                            />
                        )}
                    />
                    {leafSearchState?.status === 'error' && onLeafSearchRetry && (
                        <Button size="small" onClick={onLeafSearchRetry} sx={{ mt: 0.5 }}>
                            {t('Retry search', 'Retry search')}
                        </Button>
                    )}
                </Box>
            )}

            {showPath && selectedItems.length > 0 && (
                <Breadcrumbs
                    separator="›"
                    aria-label={label ? `${label} selected path` : 'Cascade selected path'}
                    sx={{ mb: 1.5 }}
                >
                    {selectedItems.map(({ layer, item }) => {
                        const enumKey = layer.source.type === 'enum'
                            ? layer.source.enumKey ?? layer.id
                            : undefined;
                        return (
                            <Typography key={`${layer.id}-${String(item.id)}`} variant="body2" color="text.secondary">
                                {resolveEnumItemDisplayTitle({ enumKey, item, t })}
                            </Typography>
                        );
                    })}
                </Breadcrumbs>
            )}

            {layers.length === 0 ? (
                <Typography color="error" variant="body2">
                    {t('Cascade requires at least one layer.', 'Cascade requires at least one layer.')}
                </Typography>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        alignItems: 'flex-start',
                    }}
                >
                    {layers.map((layer, index) => {
                        if (!displayActive[index])
                            return null;

                        const state = layerStates[index];
                        const selected = selections[index] ?? null;
                        const operationalError = state?.status === 'error';
                        const loading = state?.status === 'loading' || state?.status === 'loadingMore';
                        const minChars = providerMinChars(layer);
                        const uiProps = (layer.uiProps ?? {}) as any;
                        const enumKey = layer.source.type === 'enum'
                            ? layer.source.enumKey ?? layer.id
                            : undefined;
                        const layerLabel = layer.label ?? layer.id;

                        const userListboxProps = uiProps.slotProps?.listbox ?? {};
                        const renderInput = uiProps.renderInput;
                        const disabled = Boolean(uiProps.disabled) || state?.status === 'blocked';
                        const clientFilter = isProviderLayer(layer)
                            ? (options: AtEnumItemType[]) => options
                            : undefined;

                        return (
                            <Box
                                key={layer.id}
                                sx={{
                                    flex: `1 1 ${layer.minWidth ?? minColumnWidth}px`,
                                    minWidth: `min(100%, ${layer.minWidth ?? minColumnWidth}px)`,
                                }}
                            >
                                <Autocomplete
                                    {...uiProps}
                                    id={id ? `${id}-${layer.id}` : layer.id}
                                    options={state?.options ?? []}
                                    value={selected}
                                    fullWidth={uiProps.fullWidth ?? true}
                                    disabled={disabled}
                                    readOnly={readOnly || layer.readOnly}
                                    loading={loading}
                                    filterOptions={clientFilter}
                                    onOpen={() => onOpen(index)}
                                    onChange={(_event, nextValue) => onSelect(index, nextValue as AtEnumItemType | null)}
                                    onInputChange={(_event, inputValue, reason) => {
                                        if (reason === 'input' || reason === 'clear')
                                            onSearch(index, inputValue);
                                    }}
                                    getOptionLabel={(option) => resolveEnumItemDisplayTitle({
                                        enumKey,
                                        item: option,
                                        t,
                                    })}
                                    isOptionEqualToValue={(option, optionValue) => option.id === optionValue.id}
                                    slotProps={{
                                        ...uiProps.slotProps,
                                        listbox: {
                                            ...userListboxProps,
                                            onScroll: (event: React.UIEvent<HTMLElement>) => {
                                                userListboxProps.onScroll?.(event);
                                                const target = event.currentTarget;
                                                if (target.scrollHeight - target.scrollTop - target.clientHeight < 48)
                                                    onLoadMore(index);
                                            },
                                        },
                                    }}
                                    renderInput={renderInput ?? ((params) => (
                                        <TextField
                                            {...params}
                                            label={layerLabel}
                                            error={operationalError}
                                            helperText={
                                                operationalError
                                                    ? state.error
                                                    : isProviderLayer(layer) && minChars > 0 && (state?.query?.trim().length ?? 0) < minChars
                                                        ? t(`Type at least ${minChars} characters to search.`, `Type at least ${minChars} characters to search.`)
                                                        : undefined
                                            }
                                            slotProps={{
                                                ...params.slotProps,
                                                input: {
                                                    ...params.slotProps.input,
                                                    endAdornment: (
                                                        <>
                                                            {loading && <CircularProgress color="inherit" size={18} />}
                                                            {params.slotProps.input?.endAdornment}
                                                        </>
                                                    ),
                                                },
                                            }}
                                        />
                                    ))}
                                />
                                {operationalError && (
                                    <Button
                                        size="small"
                                        onClick={() => onRetry(index)}
                                        sx={{ mt: 0.5 }}
                                    >
                                        {t('Retry', 'Retry')}
                                    </Button>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            )}

            {error && helperText && (
                <FormHelperText id={helperId} error sx={{ mt: 1 }}>
                    {helperText}
                </FormHelperText>
            )}
        </Box>
    );
};

export default CascadeRenderer;
