export interface ATContainerWithTableProps {
    atFormProvidedProps: any,
    id: string,
    value: Array<any>,
    elements: any,
    getGridColumnDefs: any,
    onChange: any,
    getRowId: any,
    label: string,
    addInterface: 'formDialog' | 'form',
    addButtonOrigin: string,
    showHeader: boolean,
    height: number,
    actionPanelStyle: any,
    addButtonProps: any,
    resetFormAfterAdd: boolean,
    showHeaderlessTitle: boolean,
    disabled: boolean,
}