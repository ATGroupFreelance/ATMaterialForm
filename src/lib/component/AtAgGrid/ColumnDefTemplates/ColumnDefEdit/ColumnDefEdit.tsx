import EditOutlined from "@mui/icons-material/EditOutlined"
import ColumnDefIconButton from "../ColumnDefIconButton/ColumnDefIconButton"
import { AtAgGridColumnDefEditProps } from "../../../../types/at-ag-grid/col-def-templates/AtAgGridColumnDefEdit.type"

const EditIcon = () => <EditOutlined sx={{ color: 'primary.main' }} />

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