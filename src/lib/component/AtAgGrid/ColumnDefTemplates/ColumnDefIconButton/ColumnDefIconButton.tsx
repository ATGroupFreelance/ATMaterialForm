import { AtAgGridColumnDefIconButtonProps } from "../../../../types/at-ag-grid/col-def-templates/AtAgGridColumnDefIconButton.type"
import IconButton from "../../CellRenderers/IconButton/IconButton"
import { ColDef } from "ag-grid-community"

const ColumnDefIconButton = (props: AtAgGridColumnDefIconButtonProps) => {
    return {
        cellRenderer: IconButton,
        width: 80,
        sortable: false,
        filter: false,
        resizable: false,
        pinned: "right" as ColDef['pinned'],
        suppressMovable: true,
        ...props,
    }
}

export default ColumnDefIconButton