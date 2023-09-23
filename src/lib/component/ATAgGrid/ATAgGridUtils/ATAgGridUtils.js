import { ColumnDefTemplates } from "../ColumnDefTemplates/ColumnDefTemplates"

export const createAgGridColumnDefs = ({ field, headerName = null, sortable = true, filter = true, ...restProps }) => {
    return {
        field,
        headerName,
        sortable,
        filter,
        ...restProps,
    }
}

export const getColumnDefsByATFormElements = ({ formElements, enums, getTypeInfo }) => {
    if (!formElements)
        return []

    return formElements.map(item => {
        const typeInfo = getTypeInfo(item.type)
        const { getAgGridColumnDef } = typeInfo

        return createAgGridColumnDefs({
            ...(getAgGridColumnDef ? getAgGridColumnDef({ enums }) : {}),
            field: item.id,
            headerName: item.label || item.id,
            ...(item.colDef ? item.colDef : {})
        })
    })
}

export const createEdit = ColumnDefTemplates.createEdit
export const createRemove = ColumnDefTemplates.createRemove
export const createButton = ColumnDefTemplates.createButton