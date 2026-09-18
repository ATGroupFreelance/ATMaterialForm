import type { AtLocalizeFunction } from '../localization';
import type { AtEnumItemType } from '../types/Common.type';

export interface ResolveEnumItemDisplayTitleProps {
    enumKey?: string;
    item: AtEnumItemType;
    t: AtLocalizeFunction;
}

export const resolveEnumItemDisplayTitle = ({
    enumKey,
    item,
    t,
}: ResolveEnumItemDisplayTitleProps): string => {
    const candidates = [
        item.languageKey,
        ...(enumKey ? [`enum.${enumKey}.${item.id}`] : []),
        item.title,
    ].filter((candidate): candidate is string => Boolean(candidate));

    return t(candidates, item.title) ?? item.title;
};
