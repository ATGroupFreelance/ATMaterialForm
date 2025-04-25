import { ColDef } from "ag-grid-community";
import { AgGridReactProps } from "ag-grid-react";
import { ATFormOnClickType } from "./Common.type";

export type ATAgGridProps = AgGridReactProps & {
    ref?: React.Ref<any>,
    height?: any;
    uniqueKey?: string,
    translateUniqueKey?: boolean,
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
    onClick: ATFormOnClickType<Partial<AgGridCellRendererBaseProps>>,
    confirmationMessage?: string,
    getCellRendererParams?: any,
    color?: string,
    variant?: string,
    disabled?: boolean,
}

export interface CellRendererIconButtonBaseProps {
    onClick: ATFormOnClickType,
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
    index?: number,
    typeProps?: any,
    colProps?: ATAgGridExtendedColDef,
}
