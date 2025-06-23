import { GetTypeInfoFunctionType } from "../ATFormConfigContext.type";
import { ATEnumsType } from "../Common.type";
import { ATFieldDefinitionInterface } from "../FormBuilder.type";

export interface GetColumnDefsByATFormChildrenInterface {
    formChildren?: ATFieldDefinitionInterface[],
    enums: ATEnumsType,
    getTypeInfo: GetTypeInfoFunctionType,
}