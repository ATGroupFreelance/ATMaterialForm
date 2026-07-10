import { AtFormFieldDefInterface } from "../AtForm.type";
import { AtFormMinimalControlledUiProps } from "../Common.type";
import { AtAgGridProps } from "../at-ag-grid/AtAgGrid.type";

export type AtFormContainerWithTableProps = AtFormMinimalControlledUiProps & {
    //This is the children of containerWithTable which is shown inside the add interface, you can use formBuilder to create these elements
    formChildren?: AtFormFieldDefInterface[],
    getGridColumnDefs?: any,
    getRowId?: any,
    label?: string,
    //How are the fields and elements added to the table, a "form" at the top or by "formDialog" which opens a dialog by clicking on add?
    addInterface?: 'formDialog' | 'form',
    addButtonOrigin?: string,
    showHeader?: boolean,
    height?: number,
    actionPanelStyle?: any,
    addButtonProps?: any,
    //reset the add panel after add is done
    resetFormAfterAdd?: boolean,
    showHeaderlessTitle?: boolean,
    disabled?: boolean,
    containerProps?: AtAgGridProps,
};
