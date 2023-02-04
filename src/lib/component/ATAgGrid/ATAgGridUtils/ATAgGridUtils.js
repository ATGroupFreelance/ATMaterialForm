import { getTypeInfo } from "../../ATForm/UITypeUtils/UITypeUtils"

export const createAgGridColumnDefs = ({ field, headerName = null, sortable = true, filter = true, ...restProps }) => {
    return {
        field,
        headerName: headerName ? headerName : field,
        sortable,
        filter,
        ...restProps,
    }
}

export const getColumnDefsByATFormElements = ({ formElements, enums }) => {
    if (!formElements)
        return []

    return formElements.map(item => {
        const typeInfo = getTypeInfo(item.type)
        const { getAgGridColumnDef } = typeInfo        

        return createAgGridColumnDefs({
            ...(getAgGridColumnDef ? getAgGridColumnDef({ enums }) : {}),
            field: item.id,
            headerName: item.label === undefined ? item.id : item.label,
        })
    })
}