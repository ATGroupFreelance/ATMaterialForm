import { AtFormChildProps, AtFormFieldDefGenericProps } from "./AtForm.type";
import { AtEnumsType } from "./Common.type";
import { AtFormComboBoxAsyncOptions, AtFormComboBoxStaticOptions } from "./ui/ComboBox.type";

export interface AtFormTypeInfoInterface<T extends AtFormFieldDefGenericProps = {}> {
    type: string,
    initialValue?: any,
    isNullValueValid?: boolean,
    convertToKeyValue?: (props: AtConvertInterface<T>) => any,
    reverseConvertToKeyValue?: (props: AtReverseConvertInterface<T>) => any,
    convertToSemiKeyValue?: any,
    reverseConvertToSemiKeyValue?: any,
    validation?: any,
    getAgGridColumnDef?: any,
    isControlledUi?: boolean,
}

export type AtFormCreateControlledType = Omit<AtFormTypeInfoInterface, 'isControlledUI' | 'initialValue'> & {
    //Make sure the user has to provide an inital value if its controlled.
    initialValue: any,
}

export type AtFormCreateUncontrolledType = Pick<AtFormTypeInfoInterface, 'type' | 'getAgGridColumnDef'>

export interface AtConvertInterface<T extends AtFormFieldDefGenericProps = {}> {
    event: { target: { value: any } },
    childProps: AtFormChildProps<T>,
    enums: AtEnumsType
}

export interface AtReverseConvertInterface<T extends AtFormFieldDefGenericProps = {}> {
    value: any,
    childProps: AtFormChildProps<T>,
    enums: AtEnumsType,
    rtl?: boolean,
}

export interface AtGetTitleByEnumsInterface {
    id: string;
    enumsKey?: string;
    options?: AtFormComboBoxStaticOptions | AtFormComboBoxAsyncOptions;
    enums: any;
    value: any;
}

export interface AtFormCustomComponentInterface {
    component: any,
    typeInfo: AtFormTypeInfoInterface
}