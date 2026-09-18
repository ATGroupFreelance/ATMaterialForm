import { AtFormChildProps, AtFormFieldDefGenericProps } from "./AtForm.type";
import { AtEnumItemId, AtEnumType, AtEnumsType } from "./Common.type";

export interface AtFormTypeInfoInterface<T extends AtFormFieldDefGenericProps = any> {
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

export interface AtConvertInterface<T extends AtFormFieldDefGenericProps = any> {
    event: { target: { value: any } },
    childProps: AtFormChildProps<T>,
    enums: AtEnumsType
}

export interface AtReverseConvertInterface<T extends AtFormFieldDefGenericProps = any> {
    value: any,
    childProps: AtFormChildProps<T>,
    enums: AtEnumsType,
    rtl?: boolean,
}

export interface AtGetTitleByEnumsInterface {
    id: string;
    enumsKey?: string;
    options?: AtEnumType | null;
    enums: AtEnumsType;
    value: AtEnumItemId | null | undefined;
}

export interface AtFormCustomComponentInterface {
    component: any,
    typeInfo: AtFormTypeInfoInterface
}
