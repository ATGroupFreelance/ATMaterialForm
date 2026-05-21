import { ATFormChildProps, ATFormFieldDefGenericProps } from "./ATForm.type";
import { ATEnumsType } from "./Common.type";
import { ATFormComboBoxAsyncOptions, ATFormComboBoxStaticOptions } from "./ui/ComboBox.type";

export interface ATFormTypeInfoInterface<T extends ATFormFieldDefGenericProps = {}> {
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

export type ATFormCreateControlledType = Omit<ATFormTypeInfoInterface, 'isControlledUI' | 'initialValue'> & {
    //Make sure the user has to provide an inital value if its controlled.
    initialValue: any,
}

export type ATFormCreateUncontrolledType = Pick<ATFormTypeInfoInterface, 'type' | 'getAgGridColumnDef'>

export interface ATConvertInterface<T extends ATFormFieldDefGenericProps = {}> {
    event: { target: { value: any } },
    childProps: ATFormChildProps<T>,
    enums: ATEnumsType
}

export interface ATReverseConvertInterface<T extends ATFormFieldDefGenericProps = {}> {
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