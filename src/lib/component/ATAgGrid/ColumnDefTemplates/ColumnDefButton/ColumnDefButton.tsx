import Button from "../../CellRenderers/Button/Button";
import { ATAgGridColumnDefButtonProps } from "@/lib/types/at-ag-grid/col-def-templates/ATAgGridColumnDefButton.type";

function ColumnDefButton(props: ATAgGridColumnDefButtonProps) {
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