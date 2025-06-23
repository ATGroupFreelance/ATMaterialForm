import { GetTypeInfoFunctionType } from "../ATFormConfigContext.type";
import { ATEnumsType } from "../Common.type";
import { ATFormBuilderColumnInterface } from "../FormBuilder.type";

export interface GetColumnDefsByATFormChildrenInterface {
    formChildren?: ATFormBuilderColumnInterface[],
    enums: ATEnumsType,
    getTypeInfo: GetTypeInfoFunctionType,
}