import { GetColumnDefsByAtFormChildrenInterface } from "../../../types/at-ag-grid/AtAgGridUtils.type"
import { AtAgGridExtendedColDef } from "../../../types/at-ag-grid/AtAgGrid.type"

export const createAgGridColumnDefs = ({ field, headerName = undefined, sortable = true, filter = true, ...restProps }: AtAgGridExtendedColDef): AtAgGridExtendedColDef => {
    return {
        field,
        headerName,
        sortable,
        filter,
        ...restProps,
    }
}

export const getColumnDefsByAtFormChildren = ({ formChildren, enums, getTypeInfo }: GetColumnDefsByAtFormChildrenInterface) => {
    const result: AtAgGridExtendedColDef[] = []

    if (!formChildren)
        return result

    formChildren.forEach(item => {
        const typeInfo = getTypeInfo(item.tProps.type)

        if (typeInfo?.isControlledUi) {
            result.push(
                createAgGridColumnDefs({
                    ...(typeInfo?.getAgGridColumnDef ? typeInfo.getAgGridColumnDef({ enums }) : {}),
                    field: item.tProps.id,
                    headerName: (item.tProps.label || item.tProps.label === "") ? item.tProps.label : null,
                    ...(item.tProps.colDef ? item.tProps.colDef : {})
                })
            )
        }
    })

    return result;
}