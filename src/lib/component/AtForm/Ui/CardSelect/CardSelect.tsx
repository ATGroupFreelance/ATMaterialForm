import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { alpha, Box, ButtonBase, Chip, CircularProgress, FormHelperText, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';
import { AtEnumItemType } from '../../../../types/Common.type';
import { AtFormCardSelectItem, AtFormCardSelectProps, AtFormCardSelectTag } from '../../../../types/ui/CardSelect.type';

const UNCATEGORIZED = '__at-form-card-select-uncategorized__';

const readMetadataString = (item: AtEnumItemType, key: string) => {
    const value = item.metadata?.[key];
    return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
}

const normalizeEnumItem = (item: AtEnumItemType): AtFormCardSelectItem => {
    const metadataTags = item.metadata?.tags;
    const tags = Array.isArray(metadataTags) ? metadataTags.filter(tag => typeof tag === 'string' || typeof tag === 'number').map(tag => String(tag)) : undefined;

    return {
        id: item.id,
        title: item.title,
        subTitle: readMetadataString(item, 'subTitle') ?? readMetadataString(item, 'subtitle'),
        description: readMetadataString(item, 'description'),
        categoryId: readMetadataString(item, 'categoryId'),
        tags,
    };
}

const getTagProps = (tag: AtFormCardSelectTag) => {
    if (typeof tag === 'string')
        return { label: tag };

    return tag;
}

const CardSelect = ({ id, value, onChange, readOnly, error, helperText, label, description, options, enumsKey, categories = [], minCardWidth = 260, allowDeselect = true, disabled = false, emptyText = 'No options available' }: AtFormCardSelectProps) => {
    const theme = useTheme();
    const { enums } = useAtFormConfig();
    const [asyncData, setAsyncData] = useState<AtFormCardSelectItem[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [suppressStaleError, setSuppressStaleError] = useState(false);

    useEffect(() => {
        let isAlive = true;

        if (typeof options === 'function') {
            setLoading(true);
            options()
                .then(res => {
                    if (isAlive)
                        setAsyncData(res ?? []);
                })
                .catch(() => {
                    if (isAlive)
                        setAsyncData([]);
                })
                .finally(() => {
                    if (isAlive)
                        setLoading(false);
                });
        }
        else {
            setLoading(false);
            setAsyncData((options ?? null) as AtFormCardSelectItem[] | null);
        }

        return () => { isAlive = false; };
    }, [options]);

    useEffect(() => {
        if (!error)
            setSuppressStaleError(false);
    }, [error]);

    const searchId = enumsKey || id;
    const enumData = searchId ? enums?.[searchId] : null;
    const data = asyncData ?? enumData?.map(normalizeEnumItem) ?? [];
    const hasValue = value !== null && value !== undefined && value !== '';
    const selectedItem = hasValue ? data.find(item => String(item.id) === String(value)) : undefined;
    const displayError = Boolean(error && !suppressStaleError);

    const categoryMap = useMemo(() => new Map(categories.map(category => [category.id, category])), [categories]);
    const groupedData = useMemo(() => {
        const groups = new Map<string, AtFormCardSelectItem[]>();

        data.forEach(item => {
            const key = item.categoryId || UNCATEGORIZED;
            const existing = groups.get(key);

            if (existing)
                existing.push(item);
            else
                groups.set(key, [item]);
        });

        const orderedKeys = [...categories.map(category => category.id).filter(categoryId => groups.has(categoryId)), ...Array.from(groups.keys()).filter(categoryId => !categoryMap.has(categoryId))];

        return orderedKeys.map(categoryId => ({ categoryId, items: groups.get(categoryId) || [] }));
    }, [categories, categoryMap, data]);

    const isSelected = (item: AtFormCardSelectItem) => value !== null && value !== undefined && String(item.id) === String(value);

    const onItemClick = (item: AtFormCardSelectItem) => {
        if (disabled || readOnly || item.disabled || !onChange)
            return;

        const nextValue = allowDeselect && isSelected(item) ? null : item.id;
        setSuppressStaleError(Boolean(error && nextValue !== null && nextValue !== undefined && nextValue !== ''));
        onChange({ target: { value: nextValue } });
    }

    const renderCards = (items: AtFormCardSelectItem[]) => (
        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minCardWidth}px), 1fr))`, gap: 1.5, width: '100%' }}>
            {items.map(item => {
                const selected = isSelected(item);
                const itemDisabled = disabled || item.disabled;
                const interactionDisabled = itemDisabled || readOnly;

                return <ButtonBase
                    key={String(item.id)}
                    role="radio"
                    aria-checked={selected}
                    aria-label={item.title}
                    disabled={itemDisabled}
                    disableRipple={interactionDisabled}
                    onClick={interactionDisabled ? undefined : () => onItemClick(item)}
                    sx={{ alignItems: 'stretch', justifyContent: 'stretch', textAlign: 'start', borderRadius: 2, cursor: interactionDisabled ? 'default' : 'pointer', '&.Mui-focusVisible': { outline: `3px solid ${alpha(theme.palette.primary.main, 0.28)}`, outlineOffset: 2 } }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            minHeight: 156,
                            p: 2,
                            overflow: 'hidden',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: selected ? 'primary.main' : displayError ? alpha(theme.palette.error.main, 0.62) : 'divider',
                            bgcolor: selected ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.085) : 'background.paper',
                            boxShadow: selected ? `0 0 0 1px ${alpha(theme.palette.primary.main, 0.34)}, 0 8px 24px ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.12)}` : 'none',
                            transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow', 'transform'], { duration: theme.transitions.duration.shorter }),
                            opacity: itemDisabled ? 0.55 : 1,
                            '&::before': { content: '""', position: 'absolute', top: 0, insetInline: 12, height: 3, borderRadius: '0 0 999px 999px', bgcolor: selected ? 'primary.main' : 'transparent', transition: theme.transitions.create('background-color', { duration: theme.transitions.duration.shorter }) },
                            ...(!interactionDisabled && {
                                '&:hover': {
                                    borderColor: selected ? 'primary.main' : alpha(theme.palette.primary.main, 0.72),
                                    bgcolor: selected ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.24 : 0.11) : alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.08 : 0.025),
                                    transform: 'translateY(-1px)',
                                    boxShadow: selected ? `0 0 0 1px ${alpha(theme.palette.primary.main, 0.4)}, 0 10px 26px ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.22 : 0.15)}` : theme.shadows[1],
                                },
                            }),
                        }}
                    >
                        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: selected ? 'primary.main' : 'text.primary', transition: theme.transitions.create('color', { duration: theme.transitions.duration.shorter }) }}>{item.title}</Typography>
                                {item.subTitle && <Typography variant="body2" sx={{ mt: 0.25, color: 'text.secondary' }}>{item.subTitle}</Typography>}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', width: 28, height: 28, borderRadius: '50%', bgcolor: selected ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.24 : 0.12) : 'action.hover', transition: theme.transitions.create('background-color', { duration: theme.transitions.duration.shorter }) }}>
                                <CheckCircleRoundedIcon aria-hidden="true" fontSize="small" sx={{ color: selected ? 'primary.main' : 'action.disabled', opacity: selected ? 1 : 0.42 }} />
                            </Box>
                        </Stack>

                        {item.description && <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.65, flexGrow: 1, color: 'text.secondary' }}>{item.description}</Typography>}

                        {!!item.tags?.length && <Stack direction="row" spacing={0.75} useFlexGap sx={{ mt: 1.5, flexWrap: 'wrap' }}>
                            {item.tags.map((tag, index) => {
                                const tagProps = getTagProps(tag);
                                return <Chip key={`${String(item.id)}-${tagProps.label}-${index}`} size="small" {...tagProps} color={tagProps.color ?? (selected ? 'primary' : 'default')} variant={tagProps.variant ?? (selected ? 'outlined' : 'filled')} sx={{ height: 24, fontWeight: 700 }} />;
                            })}
                        </Stack>}
                    </Box>
                </ButtonBase>;
            })}
        </Box>
    );

    return <Box sx={{ width: '100%' }}>
        {(label || description) && <Box sx={{ mb: 1.75 }}>
            {label && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Box aria-hidden="true" sx={{ width: 5, height: 26, flex: '0 0 auto', borderRadius: 999, bgcolor: displayError ? 'error.main' : selectedItem ? 'primary.main' : 'divider', transition: theme.transitions.create('background-color', { duration: theme.transitions.duration.shorter }) }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{label}</Typography>
                {selectedItem && <Chip size="small" color="success" variant="filled" icon={<CheckCircleRoundedIcon />} label={selectedItem.title} sx={{ marginInlineStart: theme.spacing(0.5), maxWidth: 'min(42vw, 320px)', '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }} />}
            </Box>}
            {description && <Typography variant="body2" sx={{ mt: label ? 0.5 : 0, marginInlineStart: label ? theme.spacing(1.625) : 0, color: 'text.secondary' }}>{description}</Typography>}
        </Box>}

        <Box role="radiogroup" aria-label={label || id || 'Card select'} aria-invalid={displayError || undefined} aria-readonly={readOnly || undefined} aria-disabled={disabled || undefined} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {loading && <Stack direction="row" spacing={1} sx={{ py: 2, alignItems: 'center' }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Loading options...</Typography>
            </Stack>}

            {!loading && data.length === 0 && <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, px: 2, py: 3, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body2">{emptyText}</Typography>
            </Box>}

            {!loading && groupedData.map(group => {
                const category = categoryMap.get(group.categoryId);
                const showCategoryHeader = group.categoryId !== UNCATEGORIZED;

                return <Box key={group.categoryId}>
                    {showCategoryHeader && <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>{category?.title || group.categoryId}</Typography>
                            {category?.subTitle && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{category.subTitle}</Typography>}
                        </Box>
                        <Chip size="small" label={`${group.items.length} option${group.items.length === 1 ? '' : 's'}`} />
                    </Stack>}
                    {renderCards(group.items)}
                </Box>;
            })}
        </Box>

        {helperText && (!error || displayError) && <FormHelperText error={displayError} sx={{ mx: 0, mt: 1 }}>{helperText}</FormHelperText>}
    </Box>;
}

export default CardSelect;
