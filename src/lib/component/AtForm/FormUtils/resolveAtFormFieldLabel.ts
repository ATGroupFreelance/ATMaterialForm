import type { AtLocalizeFunction } from '../../../localization';

export interface ResolveAtFormFieldLabelProps {
    id: string;
    label?: string | null;
    disableLabelLocalization?: boolean;
    t: AtLocalizeFunction;
}

export const resolveAtFormFieldLabel = ({
    id,
    label,
    disableLabelLocalization,
    t,
}: ResolveAtFormFieldLabelProps): string => {
    if (disableLabelLocalization)
        return label ?? id;

    const effectiveLabel = label ?? undefined;
    const candidates = [
        `form.${id}`,
        id,
        ...(effectiveLabel !== undefined ? [effectiveLabel] : []),
    ];

    return t(candidates, effectiveLabel ?? id) ?? (effectiveLabel ?? id);
};
