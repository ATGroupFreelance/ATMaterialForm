import { ATEnumsType } from "./Common";

export interface ATTypeInterface {
    type: string,
    initialValue?: any,
    isNullValueValid?: boolean,
    convertToKeyValue?: any,
    reverseConvertToKeyValue?: any,
    convertToSemiKeyValue?: any,
    reverseConvertToSemiKeyValue?: any,
    validation?: any,
    getAgGridColumnDef?: any,
}

export interface ATConvertInterface {
    event: any,
    element: any,
    enums: ATEnumsType
}

export interface ATReverseConvertInterface {
    value: any,
    element: any,
    enums: ATEnumsType,
    rtl: boolean,
}

export interface ATGetTitleByEnumsInterface {
    id: string,
    enumsID?: string,
    options?: any[],
    enums: any,
    value: any,
}

export interface ATCreateCustomComponentInterface {
    component: any,
    type: string,
    initialValue?: any,
    isControlledUI?: boolean,
}