import DeleteForeverOutlined from "@mui/icons-material/DeleteForeverOutlined"
import { useTheme } from "@mui/material"
import ColumnDefIconButton from "../ColumnDefIconButton/ColumnDefIconButton"
import { ATAgGridColumnDefRemoveProps } from "@/lib/types/at-ag-grid/col-def-templates/ATAgGridColumnDefRemove.type"

const DeleteIcon = () => {
    const theme = useTheme()

    return <DeleteForeverOutlined color={'error'} sx={theme?.atConfig?.columnDefTemplates?.removeIcon || {}} />
}

const ColumnDefRemove = ({ cellRendererParams, ...restProps }: ATAgGridColumnDefRemoveProps) =>
    ColumnDefIconButton({
        field: 'Remove',
        width: 90,
        cellRendererParams: {
            ...(cellRendererParams || {}),
            config: {
                ...(cellRendererParams?.config || {}),
                uiProps: {
                    ...(cellRendererParams?.config?.uiProps || {}),
                    icon: <DeleteIcon />,
                }
            }
        },
        ...restProps
    })

export default ColumnDefRemove;

