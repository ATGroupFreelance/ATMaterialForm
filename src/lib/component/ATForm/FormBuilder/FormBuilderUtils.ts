import { ATFormBuilderConditionalInsertInterface } from "@/lib/types/FormBuilder.type";
import FieldDefBuilder from "./FieldDefBuilder/FieldDefBuilder";
import { ATFieldDefInterface } from "@/lib/types/FieldDefBuilder.type";

const createFieldDefBuilder = (fieldDefs: ATFieldDefInterface[]) => {
    const fieldDefBuilder = new FieldDefBuilder(fieldDefs)

    return fieldDefBuilder
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
    createFieldDefBuilder,
    insertIf,
    createColumnDefsByRowData
}