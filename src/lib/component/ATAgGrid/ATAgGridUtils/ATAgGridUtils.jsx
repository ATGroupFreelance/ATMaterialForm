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
    const result = []

    if (!formElements)
        return result

    formElements.forEach(item => {
        const typeInfo = getTypeInfo(item.type)
        const { getAgGridColumnDef, isControlledUI } = typeInfo

        if (isControlledUI) {
            result.push(
                createAgGridColumnDefs({
                    ...(getAgGridColumnDef ? getAgGridColumnDef({ enums }) : {}),
                    field: item.id,
                    headerName: (item.label || item.label === "") ? item.label : null,
                    ...(item.colDef ? item.colDef : {})
                })
            )
        }
    })

    return result;
}