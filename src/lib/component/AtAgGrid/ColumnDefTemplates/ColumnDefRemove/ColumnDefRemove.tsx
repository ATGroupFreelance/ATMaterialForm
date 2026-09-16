import DeleteForeverOutlined from "@mui/icons-material/DeleteForeverOutlined"
import ColumnDefIconButton from "../ColumnDefIconButton/ColumnDefIconButton"
import { AtAgGridColumnDefRemoveProps } from "../../../../types/at-ag-grid/col-def-templates/AtAgGridColumnDefRemove.type"

const DeleteIcon = () => <DeleteForeverOutlined color="error" />

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

