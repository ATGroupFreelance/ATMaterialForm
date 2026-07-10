import { TableCellProps, TableContainerProps, TableProps, TableRowProps, TypographyProps } from "@mui/material";
import { AtFormMinimalUncontrolledUiProps, StrictOmit } from "../Common.type";

export type AtFormTableProps = AtFormMinimalUncontrolledUiProps & StrictOmit<TypographyProps, 'id'> & {
    data: Array<any>,
    columns: Array<any>,
    tableType?: 'Vertical' | 'Horizontal',
    label?: string,
    cellStyle?: any,
    columnCellStyle?: any,
    hideColumns?: boolean,
    tableContainerProps?: TableContainerProps,
    tableProps?: TableProps,
    labelProps?: TypographyProps,
    rowProps?: TableRowProps,
    cellProps?: TableCellProps,
    headerRowProps?: TableRowProps,
    headerCellProps?: TableCellProps,
};

type AtFormTableTypeProps = StrictOmit<AtFormTableProps, 'tableType' | 'tableContainerProps' | 'tableProps' | 'label' | 'labelProps'>

export type AtFormVerticalTableProps = AtFormTableTypeProps & {
    columnsPerRow?: number,
}

export type AtFormHorizontalTableProps = AtFormTableTypeProps & {
    hideColumns?: boolean,
}