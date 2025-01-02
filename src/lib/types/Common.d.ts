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
    _formProps_?: any;
    _typeInfo_?: any;
    value?: any;
    onChange?: (event: any) => void;
    atComponentProps?: any;
}

export interface UIBuilderProps {
    _formProps_: any;
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
    _formProps_?: any;
}

export interface ATFormControlledElementProps {
    ref: ref,
    _formProps_: _formProps_,
    id: id,
    value: localValue,
    onChange: internalOnChange,
    error: error,
    helperText: helperText,
}

export interface ATFormUncontrolledElementProps {
    _formProps_: any
}

export type ATEnumType = Array<{ ID: number | string; Title: string }>;

export type ATEnumsType = { [key: string]: ATEnumType } | null | undefined;