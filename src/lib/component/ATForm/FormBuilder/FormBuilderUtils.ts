import { ATFormBuilderConditionalInsertInterface } from "@/lib/types/FormBuilder.type";
import FieldDefBuilder from "./FieldDefBuilder/FieldDefBuilder";
import { ATFieldDefInterface } from "@/lib/types/FieldDefBuilder.type";
import { ATFormFieldDefInterface } from "@/lib/types/ATForm.type";

const createFieldDefBuilder = (fieldDefs: ATFieldDefInterface[] | ATFormFieldDefInterface[]) => {
    const fieldDefBuilder = new FieldDefBuilder(fieldDefs)

    return fieldDefBuilder
}

//TODO Fixed skipRender
const insertIf = ({ condition, formChildren }: ATFormBuilderConditionalInsertInterface) => {
    if (!condition)
        return []
        // return formChildren?.map(item => {
        //     return {
        //         ...item,
        //         tProps: {
        //             ...item.tProps,
        //             skipRender: true,
        //         }
        //     }
        // })
    else
        return formChildren
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