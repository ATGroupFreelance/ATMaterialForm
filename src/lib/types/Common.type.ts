export type StrictOmit<T, K extends keyof T> = Omit<T, K>;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
};

export type PartialExcept<T, K extends keyof T> =
    Partial<Omit<T, K>> & Pick<T, K>;

export interface AtEnumCompatibleComponentProps {
    enumsKey?: string,
}

/**_--------------------------------------- */
export type StringKeyedObject = {
    [key: string]: any;
};

export type AtEnumItemType = { id: number | string; title: string, parent_id?: string, [key: string]: any }

export type AtEnumType = Array<AtEnumItemType>;

export type AtEnumsType = { [key: string]: AtEnumType } | null | undefined;

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