import { AtFormDefinitionNode } from "../AtFormLayout.type";
import { GetTypeInfoFunctionType } from "../AtFormConfigContext.type";
import { AtEnumsType } from "../Common.type";

export interface GetColumnDefsByAtFormChildrenInterface {
    formChildren?: AtFormDefinitionNode[],
    enums: AtEnumsType,
    getTypeInfo: GetTypeInfoFunctionType,
}