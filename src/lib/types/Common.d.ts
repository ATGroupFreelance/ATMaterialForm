import { ColDef } from "ag-grid-community";

export type StringKeyedObject = {
    [key: string]: any;
};

export interface ATFormOnChangeInterface {
    formData: StringKeyedObject,
    formDataKeyValue: StringKeyedObject,
    formDataSemiKeyValue: StringKeyedObject,
}

export interface ATFormChildProps {
    id: string;
    enumsID?: string;
    type: string;
    defaultValue?: any;
    inputType?: string;
    onClick?: any;
    label?: string;
    tabIndex?: number;
    colDef?: any;
    groupDataID?: string;
    skipRender?: boolean;
    wrapperRenderer?: any;
    wrapperRendererProps?: any;
    ref?: any;
    atFormProvidedProps?: any;
    _typeInfo_?: any;
    value?: any;
    onChange?: (event: any) => void;
    atComponentProps?: any;
}

export interface UIBuilderProps {
    atFormProvidedProps: any;
    id: string;
    label?: string;
    type: string;
}

// Base interface for common form element properties
export interface ATFormElementProps {
    id?: string;
    size?: ResponsiveStyleValue<GridSize>;
    label?: string;
    validation?: any;
    defaultValue?: any;
    atFormProvidedProps?: any;
}

export interface ATFormControlledElementProps {
    ref: ref,
    atFormProvidedProps: atFormProvidedProps,
    id: id,
    value: localValue,
    onChange: internalOnChange,
    error: error,
    helperText: helperText,
}

export interface ATFormUncontrolledElementProps {
    atFormProvidedProps?: any,
    id?: string,
    label?: string,
}

export type ATEnumType = Array<{ ID: number | string; Title: string }>;

export type ATEnumsType = { [key: string]: ATEnumType } | null | undefined;