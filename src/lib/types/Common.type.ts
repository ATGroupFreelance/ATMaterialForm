import { AtJsonValue } from "at-shared-types/domain";

export type StrictOmit<T, K extends keyof T> = Omit<T, K>;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
};

export type PartialExcept<T, K extends keyof T> =
    Partial<Omit<T, K>> & Pick<T, K>;

export type AtEnumKey = string;

export interface AtEnumCompatibleComponentProps {
    enumsKey?: AtEnumKey,
}

/**_--------------------------------------- */
export type StringKeyedObject = {
    [key: string]: any;
};

export type AtEnumItemId = number | string;

export type AtEnumItemType = {
    id: AtEnumItemId;

    /**
     * Canonical English title and fallback display value.
     */
    title: string;

    /**
     * Optional stable language key.
     * Example: "gender.male"
     */
    languageKey?: string;

    /**
     * Used for hierarchical enums and cascades.
     */
    parentId?: AtEnumItemId | null;

    /**
     * Optional enum-specific additional data.
     */
    metadata?: Record<string, AtJsonValue>;
};

export type AtEnumType = Array<AtEnumItemType>;

export type AtEnumsType = { [key: AtEnumKey]: AtEnumType } | null | undefined;

export interface AtFormMinimalControlledUiProps<
    T extends {
        value?: unknown;
        onChange?: (...args: any[]) => void;
    } = {
        value: any;
        onChange: (val: any) => void;
    }
> {
    id?: string;
    value?: T['value'];
    onChange?: T['onChange'];
    error?: boolean;
    helperText?: string;
    readOnly?: boolean;
}

export interface AtFormMinimalUncontrolledUiProps {
    id?: string,
}

export interface AtFormOnClickBaseProps {
    event: React.MouseEvent<HTMLButtonElement>;
    startLoading: () => void;
    stopLoading: () => void;
    [key: string]: any;
}

export type AtFormOnClickProps<TExtraProps = {}> = AtFormOnClickBaseProps & TExtraProps;

export type AtFormOnClickType<TExtraProps = {}> = (props: AtFormOnClickProps<TExtraProps>) => void;

export type AtFormGetLocalTextFunctionType = (id: string | null | undefined, fallbackLabel?: string) => string | null | undefined