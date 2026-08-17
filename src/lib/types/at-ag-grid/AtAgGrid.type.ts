import { ColDef } from "ag-grid-community";
import { AgGridReactProps, CustomCellRendererProps } from "ag-grid-react";
import { AtFormOnClickProps, AtFormOnClickType } from "../Common.type";

export type AtAgGridProps = AgGridReactProps & {
    ref?: React.Ref<any>,
    height?: any;
    uniqueKey?: string,
    translateUniqueKey?: boolean,
    tColumns?: AtAgGridTColumnInterface[],
}

export interface AtAgGridExtendedColDef extends ColDef {
    enumsKey?: any;
    enumOptions?: any;
}

export type AtAgGridCellRendererParamConfig<
    UiProps = unknown,
    ExtraParams extends object = object
> = {
    /** Use this to change UI props each time the component re-renders */
    getCellRendererParams?: (
        params: AtAgGridCustomCellRendererProps<UiProps, ExtraParams>
    ) => UiProps;
    uiProps?: UiProps;
} & ExtraParams;

export type AtAgGridBaseCellRendererParams<
    UiProps = unknown,
    ExtraParams extends object = object
> = {
    config?: AtAgGridCellRendererParamConfig<UiProps, ExtraParams>;
};

export interface AtAgGridCustomCellRendererProps<
    UiProps = unknown,
    ExtraParams extends object = object
> extends CustomCellRendererProps {
    config?: AtAgGridBaseCellRendererParams<UiProps, ExtraParams>["config"];
}

export type CreateAtCellRendererPropsInterface<
    UiProps,
    ExtraParams extends object = object
> = AtAgGridCustomCellRendererProps<UiProps, ExtraParams>;

export type AtAgGridColumnDefFromCellRenderer<
    T extends { config?: any } = any
> = ColDef & {
    cellRendererParams?: {
        config: NonNullable<T["config"]>;
    };
};

//TColumns
export interface AtAgGridTColumnInterface {
    id: string,
    type: 'FormDialog',
    index?: number,
    typeProps?: any,
    colProps?: AtAgGridExtendedColDef,
}

export type AtAgGridCellRendererOnClickProps = AtFormOnClickProps<{ data: any, cellRendererProps: AtAgGridCustomCellRendererProps }>;
export type AtAgGridCellRendererOnClickType = AtFormOnClickType<{ data: any, cellRendererProps: AtAgGridCustomCellRendererProps }>;