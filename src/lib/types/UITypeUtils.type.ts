import { ATFormChildProps } from "./ATForm.type";
import { ATEnumsType } from "./Common.type";
import { ATFormBuilerColumnGenericProps } from "./FormBuilder.type";
import { ATFormComboBoxOptionsType } from "./ui/ComboBox.type";

export interface ATTypeInterface<T extends ATFormBuilerColumnGenericProps = {}> {
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

export interface ATConvertInterface<T extends ATFormBuilerColumnGenericProps = {}> {
    event: { target: { value: any } },
    childProps: ATFormChildProps<T>,
    enums: ATEnumsType
}

export interface ATReverseConvertInterface<T extends ATFormBuilerColumnGenericProps = {}> {
    value: any,
    childProps: ATFormChildProps<T>,
    enums: ATEnumsType,
    rtl?: boolean,
}

export interface ATGetTitleByEnumsInterface {
    id: string,
    enumsID?: string,
    options?: ATFormComboBoxOptionsType,
    enums: any,
    value: any,
}

export interface ATFormCustomComponentInterface {
    component: any,
    typeInfo: ATTypeInterface
}