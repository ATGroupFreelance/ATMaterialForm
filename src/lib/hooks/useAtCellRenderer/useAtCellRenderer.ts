import { AtAgGridCustomCellRendererProps } from "../../types/at-ag-grid/AtAgGrid.type"

const useAtCellRenderer = (props: AtAgGridCustomCellRendererProps<any, any>) => {
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



export { useAtCellRenderer }