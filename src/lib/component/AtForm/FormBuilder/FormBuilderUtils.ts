import { AtFormBuilderConditionalInsertInterface } from "../../../types/FormBuilder.type";
import FieldDefBuilder from "./FieldDefBuilder/FieldDefBuilder";
import { AtFieldDefInterface } from "../../../types/FieldDefBuilder.type";
import { AtFormFieldDefInterface } from "../../../types/AtForm.type";

const createFieldDefBuilder = (fieldDefs: AtFieldDefInterface[] | AtFormFieldDefInterface[]) => {
    const fieldDefBuilder = new FieldDefBuilder(fieldDefs)

    return fieldDefBuilder
}

//TODO Fixed skipRender
const insertIf = ({ condition, formChildren }: AtFormBuilderConditionalInsertInterface) => {
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