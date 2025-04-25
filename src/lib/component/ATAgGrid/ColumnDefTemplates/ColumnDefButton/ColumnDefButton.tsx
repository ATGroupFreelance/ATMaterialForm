import { CellRendererButtonColumnDefProps } from "@/lib/types/ATAgGrid.type";
import Button from "../../CellRenderers/Button/Button";

function ColumnDefButton({ cellRendererParams, ...restColDefProps }: CellRendererButtonColumnDefProps) {
    return {
        cellRenderer: Button,
        cellRendererParams,
        width: 160,
        ...restColDefProps
    }
}

export default ColumnDefButton;