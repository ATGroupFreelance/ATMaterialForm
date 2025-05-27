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
    enumsKey?: any;
    enumOptions?: any;
}

export type ATAgGridCellRendererParamConfig<
    UIProps = unknown,
    ExtraParams extends object = {}
> = {
    /** Use this to change UI props each time the component re-renders */
    getCellRendererParams?: (
        params: ATAgGridCustomCellRendererProps<UIProps, ExtraParams>
    ) => UIProps;
    uiProps?: UIProps;
} & ExtraParams;

export type ATAgGridBaseCellRendererParams<
    UIProps = unknown,
    ExtraParams extends object = {}
> = {
    config?: ATAgGridCellRendererParamConfig<UIProps, ExtraParams>;
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

export type ATAgGridColumnDefFromCellRenderer<
    T extends { config?: any } = any
> = ColDef & {
    cellRendererParams?: {
        config: NonNullable<T["config"]>;
    };
};

//TColumns
export interface ATAgGridTColumnInterface {
    id: string,
    type: 'FormDialog',
    index?: number,
    typeProps?: any,
    colProps?: ATAgGridExtendedColDef,
}
