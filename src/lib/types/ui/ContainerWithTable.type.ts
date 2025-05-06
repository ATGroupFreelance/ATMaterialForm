import { ATFormMinimalControlledUIProps } from "../Common.type";
import { ATAgGridProps } from "../ATAgGrid.type";

export type ATFormContainerWithTableProps = ATFormMinimalControlledUIProps & {
    //This is the children of containerWithTable which is shown inside the add interface, you can use formBuilder to create these elements
    elements?: any,
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
    containerProps?: ATAgGridProps,
};
