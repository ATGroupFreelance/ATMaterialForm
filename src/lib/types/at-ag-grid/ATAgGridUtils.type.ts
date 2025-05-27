import { GetTypeInfoFunctionType } from "../ATFormConfigContext.type";
import { ATEnumsType } from "../Common.type";
import { ATFormBuilerColumnInterface } from "../FormBuilder.type";

export interface GetColumnDefsByATFormChildrenInterface {
    formChildren?: ATFormBuilerColumnInterface[],
    enums: ATEnumsType,
    getTypeInfo: GetTypeInfoFunctionType,
}