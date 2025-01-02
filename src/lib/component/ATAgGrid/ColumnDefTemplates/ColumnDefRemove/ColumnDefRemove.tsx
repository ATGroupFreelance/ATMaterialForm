import { DeleteForeverOutlined } from "@mui/icons-material"
import { CellRendererIconButtonColumnDefProps } from "@/lib/types/ATAgGrid"
import { useTheme } from "@mui/material"
import ColumnDefIconButton from "../ColumnDefIconButton/ColumnDefIconButton"

const DeleteIcon = () => {
    const theme = useTheme()

    //@ts-ignore
    return <DeleteForeverOutlined color={'red'} sx={theme?.atConfig?.columnDefTemplates?.removeIcon || {}} />
}

const ColumnDefRemove = ({ cellRendererParams, ...restProps }: CellRendererIconButtonColumnDefProps) =>
    ColumnDefIconButton({ field: 'Remove', cellRendererParams: { ...cellRendererParams, icon: <DeleteIcon /> }, width: 90, ...restProps })

export default ColumnDefRemove