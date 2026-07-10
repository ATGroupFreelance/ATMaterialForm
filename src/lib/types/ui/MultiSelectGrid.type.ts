import { AtFormMinimalControlledUiProps, AtFormOnClickType, StrictOmit } from "../Common.type";
import { AtAgGridProps } from "../at-ag-grid/AtAgGrid.type";
import { AtFormButtonProps } from "./Button.type";
import { RowSelectionOptions } from "ag-grid-community";
import { GridProps } from "@mui/material";

export type AtFormMultiSelectGridProps = AtFormMinimalControlledUiProps & StrictOmit<AtAgGridProps, 'rowSelection'> & {
    label?: string,
    onConfirmButtonClick?: AtFormOnClickType,
    confirmButtonProps?: AtFormButtonProps & {
        wrapperRendererProps?: GridProps,
    },
    rowSelection?: RowSelectionOptions<any>,
};
