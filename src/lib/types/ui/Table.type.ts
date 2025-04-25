import { TableCellProps, TableContainerProps, TableProps, TableRowProps, TypographyProps } from "@mui/material";
import { ATFormMinimalUncontrolledUIProps, StrictOmit } from "../Common.type";

export type ATFormTableProps = ATFormMinimalUncontrolledUIProps & StrictOmit<TypographyProps, 'id'> & {
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

type ATFormTableTypeProps = StrictOmit<ATFormTableProps, 'tableType' | 'tableContainerProps' | 'tableProps' | 'label' | 'labelProps'>

export type ATFormVerticalTableProps = ATFormTableTypeProps & {
    columnsPerRow?: number,
}

export type ATFormHorizontalTableProps = ATFormTableTypeProps & {
    hideColumns?: boolean,
}