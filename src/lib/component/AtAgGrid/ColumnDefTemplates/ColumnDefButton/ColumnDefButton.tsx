import Button from "../../CellRenderers/Button/Button";
import { AtAgGridColumnDefButtonProps } from "../../../../types/at-ag-grid/col-def-templates/AtAgGridColumnDefButton.type";

function ColumnDefButton(props: AtAgGridColumnDefButtonProps) {
    return {
        sortable: false,
        filter: false,
        resizable: false,
        cellRenderer: Button,
        width: 160,
        ...props,
    }
}

export default ColumnDefButton;