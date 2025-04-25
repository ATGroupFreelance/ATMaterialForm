import { EditOutlined } from "@mui/icons-material"
import { CellRendererIconButtonColumnDefProps } from "@/lib/types/ATAgGrid.type"
import { useTheme } from "@mui/material"
import ColumnDefIconButton from "../ColumnDefIconButton/ColumnDefIconButton"

const EditIcon = () => {
    const theme = useTheme()

    //@ts-ignore
    return <EditOutlined sx={theme?.atConfig?.columnDefTemplates?.editIcon || {}} />
}


const ColumnDefEdit = ({ cellRendererParams, ...restProps }: CellRendererIconButtonColumnDefProps) =>
    ColumnDefIconButton({ field: 'Edit', cellRendererParams: { ...cellRendererParams, icon: <EditIcon /> }, width: 80, ...restProps })


export default ColumnDefEdit