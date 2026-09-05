import { ChipProps } from "@mui/material";
import { AtEnumItemId, AtFormMinimalControlledUiProps } from "../Common.type";

export type AtFormCardSelectTag = string | {
    label: string,
    color?: ChipProps['color'],
    variant?: ChipProps['variant'],
};

export interface AtFormCardSelectCategory {
    id: string,
    title: string,
    subTitle?: string,
}

export interface AtFormCardSelectItem {
    id: AtEnumItemId,
    title: string,
    subTitle?: string,
    description?: string,
    tags?: AtFormCardSelectTag[],
    categoryId?: string,
    disabled?: boolean,
}

export type AtFormCardSelectStaticOptions = AtFormCardSelectItem[] | null | undefined;
export type AtFormCardSelectAsyncOptions = () => Promise<AtFormCardSelectStaticOptions>;

export type AtFormCardSelectProps = AtFormMinimalControlledUiProps<{
    value: AtEnumItemId | null;
    onChange: (event: { target: { value: AtEnumItemId | null } }) => void;
}> & {
    label?: string,
    description?: string,
    options?: AtFormCardSelectStaticOptions | AtFormCardSelectAsyncOptions,
    enumsKey?: string,
    categories?: AtFormCardSelectCategory[],
    minCardWidth?: number,
    allowDeselect?: boolean,
    disabled?: boolean,
    emptyText?: string,
};
