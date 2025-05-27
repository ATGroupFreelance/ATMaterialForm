import Button from "../../CellRenderers/Button/Button";
import { ATAgGridColumnDefButtonProps } from "@/lib/types/at-ag-grid/col-def-templates/ATAgGridColumnDefButton.type";

function ColumnDefButton(props: ATAgGridColumnDefButtonProps) {
    return {
        ...props,
        cellRenderer: Button,
        width: 160,
    }
}

export default ColumnDefButton;