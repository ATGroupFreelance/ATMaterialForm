import { ATAgGridCustomCellRendererProps } from "@/lib/types/at-ag-grid/ATAgGrid.type"

const useATCellRenderer = (props: ATAgGridCustomCellRendererProps<any, any>) => {
  const label: string =
    (props.config?.uiProps as any)?.label ||
    props.colDef?.headerName ||
    props.colDef?.field ||
    "";


  let cellRendererParams: any = {}

  if (props.config?.getCellRendererParams) {
    cellRendererParams = props.config.getCellRendererParams(props)
  }

  return { label, cellRendererParams };
};



export { useATCellRenderer }