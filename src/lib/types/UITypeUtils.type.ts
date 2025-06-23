import { ATFormChildProps, ATFormFieldDefinitionGenericProps } from "./ATForm.type";
import { ATEnumsType } from "./Common.type";
import { ATFormComboBoxAsyncOptions, ATFormComboBoxStaticOptions } from "./ui/ComboBox.type";

export interface ATFormTypeInfoInterface<T extends ATFormFieldDefinitionGenericProps = {}> {
    type: string,
    initialValue?: any,
    isNullValueValid?: boolean,
    convertToKeyValue?: (props: ATConvertInterface<T>) => any,
    reverseConvertToKeyValue?: (props: ATReverseConvertInterface<T>) => any,
    convertToSemiKeyValue?: any,
    reverseConvertToSemiKeyValue?: any,
    validation?: any,
    getAgGridColumnDef?: any,
    isControlledUI?: boolean,
}

export interface ATConvertInterface<T extends ATFormFieldDefinitionGenericProps = {}> {
    event: { target: { value: any } },
    childProps: ATFormChildProps<T>,
    enums: ATEnumsType
}

export interface ATReverseConvertInterface<T extends ATFormFieldDefinitionGenericProps = {}> {
    value: any,
    childProps: ATFormChildProps<T>,
    enums: ATEnumsType,
    rtl?: boolean,
}

export interface ATGetTitleByEnumsInterface {
    id: string;
    enumsKey?: string;
    options?: ATFormComboBoxStaticOptions | ATFormComboBoxAsyncOptions;
    enums: any;
    value: any;
}

export interface ATFormCustomComponentInterface {
    component: any,
    typeInfo: ATFormTypeInfoInterface
}