export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

export interface ATEnumCompatibleComponentProps {
    enumsID?: string,
}

/**_--------------------------------------- */
export type StringKeyedObject = {
    [key: string]: any;
};

export type ATEnumItemType = { id: number | string; title: string, parent_id?: string, [key: string]: number | string | undefined }

export type ATEnumType = Array<ATEnumItemType>;

export type ATEnumsType = { [key: string]: ATEnumType } | null | undefined;

export interface ATFormMinimalControlledUIProps<
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

export interface ATFormMinimalUncontrolledUIProps {
    id?: string,
}

export interface BaseATFormOnClickProps {
    event: React.MouseEvent<HTMLButtonElement>;
    startLoading: () => void;
    stopLoading: () => void;
    [key: string]: any;
}

export type ATFormOnClickProps<TExtraProps = {}> = BaseATFormOnClickProps & TExtraProps;

export type ATFormOnClickType<TExtraProps = {}> = (props: ATFormOnClickProps<TExtraProps>) => void;
