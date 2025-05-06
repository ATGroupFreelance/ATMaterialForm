import { ATFormBuilderConditionalInsertInterface, ATFormBuilerColumnInterface } from "@/lib/types/FormBuilder.type";
import ColumnBuilder from "./ColumnBuilder/ColumnBuilder";


const createColumnBuilder = (columns: ATFormBuilerColumnInterface[]) => {
    const columnBuilder = new ColumnBuilder(columns)

    return columnBuilder
}

const createConditionalInsert = ({ condition, elements }: ATFormBuilderConditionalInsertInterface) => {
    if (!condition)
        return []
    else
        return elements
}

const createColumnDefsByRowData = (rowData: any) => {
    const result = []

    if (rowData && Array.isArray(rowData) && rowData.length > 0) {
        const firstSlot = rowData[0]

        for (let key in firstSlot) {
            result.push({
                field: key,
            })
        }
    }

    return result
}

export const formBuilderUtils = {
    createColumnBuilder,
    createConditionalInsert,
    createColumnDefsByRowData
}