import { GetTypeInfoFunctionType } from "../ATFormConfigContext.type";
import { ATEnumsType } from "../Common.type";
import { ATFieldDefInterface } from "../FormBuilder.type";

export interface GetColumnDefsByATFormChildrenInterface {
    formChildren?: ATFieldDefInterface[],
    enums: ATEnumsType,
    getTypeInfo: GetTypeInfoFunctionType,
}