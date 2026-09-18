import type { AtLocalizeFunction } from '../../localization';

export interface ResolveAgGridHeaderNameProps {
    field?: string | null;
    headerName?: string | null;
    disableHeaderLocalization?: boolean;
    t: AtLocalizeFunction;
}

export const resolveAgGridHeaderName = ({
    field,
    headerName,
    disableHeaderLocalization,
    t,
}: ResolveAgGridHeaderNameProps): string | undefined => {
    if (disableHeaderLocalization)
        return headerName ?? field ?? undefined;

    if (!field)
        return headerName ?? undefined;

    const candidates = [
        `grid.${field}`,
        field,
        ...(headerName ? [headerName] : []),
    ];

    return t(candidates, headerName ?? field) ?? (headerName ?? field);
};
