type StringKeyedObject = {
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