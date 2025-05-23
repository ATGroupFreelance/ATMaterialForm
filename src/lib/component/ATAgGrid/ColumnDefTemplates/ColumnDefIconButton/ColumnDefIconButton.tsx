import IconButton from "../../CellRenderers/IconButton/IconButton"
import { CellRendererIconButtonColumnDefProps } from "@/lib/types/ATAgGrid.type"

const ColumnDefIconButton = ({ cellRendererParams, ...restColDef }: CellRendererIconButtonColumnDefProps) => {
    return {
        cellRenderer: IconButton,
        cellRendererParams,        
        width: 80,
        ...restColDef,
    }
}

export default ColumnDefIconButton