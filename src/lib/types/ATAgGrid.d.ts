import { ColDef } from "ag-grid-community";
import { AgGridReactProps } from "ag-grid-react";
import { ATButtonOnClickHandler } from "./Button";
import { ATFormUncontrolledElementProps } from "./Common";

export interface ATAgGridProps extends AgGridReactProps, ATFormUncontrolledElementProps {
    ref?: any,
    height?: any;
    tColumns?: ATAgGridTColumnInterface[],
}

export interface ATAgGridExtendedColDef extends ColDef {
    enumID?: any;
    enumOptions?: any;
}

export interface AgGridCellRendererBaseProps {
    data?: any,
    colDef: ColDef,
    api: any,
    setValue: any,
    commonEventProps: any,
}

export interface CellRendererButtonBaseProps {
    onClick: ATButtonOnClickHandler<Partial<AgGridCellRendererBaseProps>>,
    confirmationMessage?: string,
    getCellRendererParams?: any,
    color?: string,
    variant?: string,
    disabled?: boolean,
}

export interface CellRendererIconButtonBaseProps {
    onClick: ATButtonOnClickHandler,
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

//TColumns
export interface ATAgGridTColumnInterface {
    id: string,
    type: 'FormDialog',
    index?: integer,
    typeProps?: any,
    colProps?: ATAgGridExtendedColDef,
}
