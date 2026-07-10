import EditOutlined from "@mui/icons-material/EditOutlined"
import { useTheme } from "@mui/material"
import ColumnDefIconButton from "../ColumnDefIconButton/ColumnDefIconButton"
import { AtAgGridColumnDefEditProps } from "../../../../types/at-ag-grid/col-def-templates/AtAgGridColumnDefEdit.type"

const EditIcon = () => {
    const theme = useTheme()

    return <EditOutlined sx={theme?.atConfig?.columnDefTemplates?.editIcon || {}} />
}

const ColumnDefEdit = ({ cellRendererParams, ...restProps }: AtAgGridColumnDefEditProps) =>
    ColumnDefIconButton({
        field: 'Edit',
        width: 80,
        cellRendererParams: {
            ...(cellRendererParams || {}),
            config: {
                ...(cellRendererParams?.config || {}),
                uiProps: {
                    ...(cellRendererParams?.config?.uiProps || {}),
                    icon: <EditIcon />,
                }
            }
        },
        ...restProps
    })

export default ColumnDefEdit