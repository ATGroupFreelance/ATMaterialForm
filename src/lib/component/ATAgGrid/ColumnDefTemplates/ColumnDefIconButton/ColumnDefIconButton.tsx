import { ATAgGridColumnDefIconButtonProps } from "@/lib/types/at-ag-grid/col-def-templates/ATAgGridColumnDefIconButton.type"
import IconButton from "../../CellRenderers/IconButton/IconButton"

const ColumnDefIconButton = (props: ATAgGridColumnDefIconButtonProps) => {
    return {
        cellRenderer: IconButton,
        width: 80,
        sortable: false,
        filter: false,
        resizable: false,
        ...props,
    }
}

export default ColumnDefIconButton