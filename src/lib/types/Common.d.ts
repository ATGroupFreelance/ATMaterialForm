export type StringKeyedObject = {
    [key: string]: any;
};

export interface ATFormOnChangeInterface {
    formData: StringKeyedObject,
    formDataKeyValue: StringKeyedObject,
    formDataSemiKeyValue: StringKeyedObject,
}

export interface ATFormCoreElementProps {
    id: string,
    size?: ResponsiveStyleValue<GridSize>,
    wrapper?: any,
    wrapperProps?: any,
}

export type ATEnumType = Array<{ ID: number | string; Title: string }>;

export type ATEnumsType = { [key: string]: ATEnumType } | null | undefined;