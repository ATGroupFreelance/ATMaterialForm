import { ColDef } from "ag-grid-community";
import { AgGridReactProps } from "ag-grid-react";

export interface ATAgGridProps extends AgGridReactProps {
    height?: any;
}

export interface AgGridCellRendererBaseProps {
    data,
    colDef: ColDef,
    api: any,
    setValue: any,
    commonEventProps: any,
}

export interface CellRendererButtonBaseProps {
    onClick: any,
    confirmationMessage?: string,
    getCellRendererParams?: any,
    color?: string,
    variant?: string,
    disabled?: boolean,
}

export interface CellRendererIconButtonBaseProps {
    onClick: any,
    icon?: any,
    confirmationMessage?: string
    tooltip?: string,
    getCellRendererParams?: any
}

/**Components */
export interface CellRendererButtonProps extends AgGridCellRendererBaseProps, CellRendererButtonBaseProps { }
export interface CellRendererIconButtonProps extends AgGridCellRendererBaseProps, CellRendererIconButtonBaseProps { }

/**ColumnDefs */
export interface CellRendererButtonColumnDefProps extends ColDef {
    cellRendererParams: CellRendererButtonBaseProps;
}

export interface CellRendererIconButtonColumnDefProps extends ColDef {
    cellRendererParams: CellRendererIconButtonBaseProps;
}