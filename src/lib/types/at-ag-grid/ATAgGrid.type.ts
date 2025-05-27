import { ColDef } from "ag-grid-community";
import { AgGridReactProps, CustomCellRendererProps } from "ag-grid-react";

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

export type ATAgGridBaseCellRendererParams<
    UIProps = unknown,
    ExtraParams extends object = {}
> = {
    config?: {
        /**Use this to change ui params each time the component rerenders */
        getCellRendererParams?: (params: ATAgGridCustomCellRendererProps<UIProps, ExtraParams>) => UIProps;
        uiProps?: UIProps;
    } & ExtraParams;
};

export interface ATAgGridCustomCellRendererProps<
    UIProps = unknown,
    ExtraParams extends object = {}
> extends CustomCellRendererProps {
    config?: ATAgGridBaseCellRendererParams<UIProps, ExtraParams>["config"];
}

export type CreateATCellRendererPropsInterface<
    UIProps,
    ExtraParams extends object = {}
> = ATAgGridCustomCellRendererProps<UIProps, ExtraParams>;

//TColumns
export interface ATAgGridTColumnInterface {
    id: string,
    type: 'FormDialog',
    index?: number,
    typeProps?: any,
    colProps?: ATAgGridExtendedColDef,
}
