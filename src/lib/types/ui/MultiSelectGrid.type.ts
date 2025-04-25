import { ATFormMinimalControlledUIProps, ATFormOnClickType, StrictOmit } from "../Common.type";
import { ATAgGridProps } from "../ATAgGrid.type";
import { ATFormButtonProps } from "./Button.type";
import { RowSelectionOptions } from "ag-grid-community";
import { GridProps } from "@mui/material";

export type ATFormMultiSelectGridProps = ATFormMinimalControlledUIProps & StrictOmit<ATAgGridProps, 'rowSelection'> & {
    label?: string,
    onConfirmButtonClick?: ATFormOnClickType,
    confirmButtonProps?: ATFormButtonProps & {
        wrapperRendererProps?: GridProps,
    },
    rowSelection?: RowSelectionOptions<any>,
};
