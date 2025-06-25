import { ATFormFieldDefInterface } from "../ATForm.type";
import { GetTypeInfoFunctionType } from "../ATFormConfigContext.type";
import { ATEnumsType } from "../Common.type";

export interface GetColumnDefsByATFormChildrenInterface {
    formChildren?: ATFormFieldDefInterface[],
    enums: ATEnumsType,
    getTypeInfo: GetTypeInfoFunctionType,
}