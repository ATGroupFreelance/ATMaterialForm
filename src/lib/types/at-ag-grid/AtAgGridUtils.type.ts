import { AtFormFieldDefInterface } from "../AtForm.type";
import { GetTypeInfoFunctionType } from "../AtFormConfigContext.type";
import { AtEnumsType } from "../Common.type";

export interface GetColumnDefsByAtFormChildrenInterface {
    formChildren?: AtFormFieldDefInterface[],
    enums: AtEnumsType,
    getTypeInfo: GetTypeInfoFunctionType,
}