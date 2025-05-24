import { GetColumnDefsByATFormChildrenInterface } from "@/lib/types/ATAgGridUtils.type"
import { ATAgGridExtendedColDef } from "@/lib/types/ATAgGrid.type"

export const createAgGridColumnDefs = ({ field, headerName = undefined, sortable = true, filter = true, ...restProps }: ATAgGridExtendedColDef): ATAgGridExtendedColDef => {
    return {
        field,
        headerName,
        sortable,
        filter,
        ...restProps,
    }
}

export const getColumnDefsByATFormChildren = ({ formChildren, enums, getTypeInfo }: GetColumnDefsByATFormChildrenInterface) => {
    const result: ATAgGridExtendedColDef[] = []

    if (!formChildren)
        return result

    formChildren.forEach(item => {
        const typeInfo = getTypeInfo(item.tProps.type)

        if (typeInfo?.isControlledUI) {
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