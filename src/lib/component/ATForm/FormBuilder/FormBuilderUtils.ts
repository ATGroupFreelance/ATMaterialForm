import { ATFormBuilderConditionalInsertInterface } from "@/lib/types/FormBuilder.type";
import FieldDefinitionBuilder from "./FieldDefinitionBuilder/FieldDefinitionBuilder";
import { ATFieldDefinitionInterface } from "@/lib/types/FieldDefinitionBuilder.type";


const createFieldDefinitionBuilder = (fieldDefinitions: ATFieldDefinitionInterface[]) => {
    const fieldDefinitionBuilder = new FieldDefinitionBuilder(fieldDefinitions)

    return fieldDefinitionBuilder
}

const insertIf = ({ condition, elements }: ATFormBuilderConditionalInsertInterface) => {
    if (!condition)
        return elements?.map(item => {
            return {
                ...item,
                tProps: {
                    ...item.tProps,
                    skipRender: true,
                }
            }
        })
    else
        return elements
}

const createColumnDefsByRowData = (rowData: any) => {
    const result = []

    if (rowData && Array.isArray(rowData) && rowData.length > 0) {
        const firstSlot = rowData[0]

        for (const key in firstSlot) {
            result.push({
                field: key,
            })
        }
    }

    return result
}

export const formBuilderUtils = {
    createFieldDefinitionBuilder,
    insertIf,
    createColumnDefsByRowData
}