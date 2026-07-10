import DeleteForeverOutlined from "@mui/icons-material/DeleteForeverOutlined"
import { useTheme } from "@mui/material"
import ColumnDefIconButton from "../ColumnDefIconButton/ColumnDefIconButton"
import { AtAgGridColumnDefRemoveProps } from "../../../../types/at-ag-grid/col-def-templates/AtAgGridColumnDefRemove.type"

const DeleteIcon = () => {
    const theme = useTheme()

    return <DeleteForeverOutlined color={'error'} sx={theme?.atConfig?.columnDefTemplates?.removeIcon || {}} />
}

const ColumnDefRemove = ({ cellRendererParams, ...restProps }: AtAgGridColumnDefRemoveProps) =>
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

