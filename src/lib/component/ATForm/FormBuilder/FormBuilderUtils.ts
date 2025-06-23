import { ATFormBuilderConditionalInsertInterface, ATFormBuilderColumnInterface } from "@/lib/types/FormBuilder.type";
import ColumnBuilder from "./ColumnBuilder/ColumnBuilder";


const createColumnBuilder = (columns: ATFormBuilderColumnInterface[]) => {
    const columnBuilder = new ColumnBuilder(columns)

    return columnBuilder
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
    createColumnBuilder,
    insertIf,
    createColumnDefsByRowData
}