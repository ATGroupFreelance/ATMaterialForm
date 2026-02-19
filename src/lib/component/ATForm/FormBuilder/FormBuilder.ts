import { ATFormBuilderCreateInterface, ATFormFieldTypelessTProps } from "../../../types/FormBuilder.type";

import { ATFormTextBoxProps } from "../../../types/ui/TextBox.type";
import { ATFormIntegerTextBoxProps } from "../../../types/ui/IntegerTextBox.type";
import { ATFormFloatTextBoxProps } from "../../../types/ui/FloatTextBox.type";
import { ATFormButtonProps } from "../../../types/ui/Button.type";
import { ATFormComboBoxProps } from "../../../types/ui/ComboBox.type";
import { ATFormMultiComboBoxProps } from "../../../types/ui/MultiComboBox.type";
import { ATFormDatePickerProps } from "../../../types/ui/DatePicker.type";
import { ATFormUploadButtonProps } from "../../../types/ui/UploadButton.type";
import { ATFormUploadImageButtonProps } from "../../../types/ui/UploadImageButton.type";
import { ATFormFileViewerProps } from "../../../types/ui/FileViewer.type";
import { ATFormCascadeComboBoxProps } from "../../../types/ui/CascadeComboBox.type";
import { ATFormMultiValueCascadeComboBoxProps } from "../../../types/ui/MultiValueCascadeComboBox.type";
import { GridProps } from "@mui/material";
import { ATFormCheckBoxProps } from "../../../types/ui/CheckBox.type";
import { ATFormSliderProps } from "../../../types/ui/Slider.type";
import { ATFormPasswordTextBoxProps } from "../../../types/ui/PasswordTextBox.type";
import { ATFormDoublePasswordTextBoxProps } from "../../../types/ui/DoublePasswordTextBox.type";
import { ATFormAvatarProps } from "../../../types/ui/Avatar.type";
import { ATFormLabelProps } from "../../../types/ui/Label.type";
import { ATFormMultiSelectTextBoxProps } from "../../../types/ui/MultiSelectTextBox.type";
import { ATFormTableProps } from "../../../types/ui/Table.type";
import { ATFormImageSelectProps } from "../../../types/ui/ImageSelect.type";
import { ATFormAdvanceStepperProps } from "../../../types/ui/AdvanceStepper.type";
import { ATFormFormProps } from "../../../types/ui/Form.type";
import { ATFormColorTextBoxProps } from "../../../types/ui/ColorTextBox.type";
import { ATFormContainerWithTableProps } from "../../../types/ui/ContainerWithTable.type";
import { ATFormMultiSelectGridProps } from "../../../types/ui/MultiSelectGrid.type";
import { ATFormFieldDefInterface } from "../../../types/ATForm.type";
import { formBuilderUtils } from "./FormBuilderUtils";
import { ATFormFormDialogProps } from "../../../types/ui/FormDialog.type";
import { ATFormCustomControlledFieldProps } from "../../../types/ui/CustomControlledField.type";
import { ATFormCustomUncontrolledFieldProps } from "../../../types/ui/CustomUncontrolledField.type";

// const splitCapitalBySpace = (input: string) => {
//     const result = input.replace(/([A-Z]+)/g, ",$1").replace(/^,/, "");
//     return result.split(",").join(' ');
// }

const create = (props: ATFormBuilderCreateInterface): ATFormFieldDefInterface => {
    return {
        tProps: {
            type: props.type,
            ...props.tProps,
            size: props.tProps.size || props.defaultSize
        },
        uiProps: props.uiProps,
    }
}

/**
 * @example
 * formBuilder
    .createFieldDefBuilder(Columns)
    .remove(['B'])    
    .override(
        {
            A: { onChange: (event) => setA(event.target.value) },            
        }
    )
    .build()
 * @param {fieldDefs} columns: Array of {id, label, gridProps, uiProps}
 */

const createTextBox = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormTextBoxProps) => {
    return create({
        type: 'TextBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createIntegerTextBox = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormIntegerTextBoxProps) => {
    return create({
        type: 'IntegerTextBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createFloatTextBox = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormFloatTextBoxProps) => {
    return create({
        type: 'FloatTextBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createButton = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormButtonProps) => {
    return create({
        type: 'Button',
        defaultSize: 2,
        tProps,
        uiProps,
    })
}

const createComboBox = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormComboBoxProps) => {
    return create({
        type: 'ComboBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createMultiComboBox = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormMultiComboBoxProps) => {
    return create({
        type: 'MultiComboBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createDatePicker = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormDatePickerProps) => {
    return create({
        type: 'DatePicker',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

/**
 * @example
 * formBuilder.createUploadButton({ id: 'UploadButtonType1', size: 6, uploadButtonViewType: 1 }),
   formBuilder.createUploadButton({ id: 'UploadButtonType2', size: 6, uploadButtonViewType: 2 }),
 * @param {uploadButtonViewType} uploadButtonViewType: This button has 2 views, you can switch between them by passing a viewType number, the acceptable values are 1 and 2
 */

const createUploadButton = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormUploadButtonProps) => {
    return create({
        type: 'UploadButton',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createUploadImageButton = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormUploadImageButtonProps) => {
    return create({
        type: 'UploadImageButton',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createFileViewer = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormFileViewerProps) => {
    return create({
        type: 'FileViewer',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createCascadeComboBox = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormCascadeComboBoxProps) => {
    return create({
        type: 'CascadeComboBox',
        defaultSize: 12,
        tProps: {
            ...tProps,
            wrapperRenderer: {
                ...(tProps?.wrapperRenderer || {}),
                config: {
                    container: true,
                    spacing: 2,
                    ...(tProps?.wrapperRenderer?.config) || {},
                }
            },
        },
        uiProps,
    })
}

const createMultiValueCascadeComboBox = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormMultiValueCascadeComboBoxProps) => {
    return create({
        type: 'MultiValueCascadeComboBox',
        defaultSize: 12,
        tProps: {
            ...tProps,
            wrapperRenderer: {
                ...(tProps?.wrapperRenderer || {}),
                config: {
                    container: true,
                    spacing: 2,
                    ...(tProps?.wrapperRenderer?.config) || {},
                }
            },
        },
        uiProps,
    })
}

const createGrid = (tProps: ATFormFieldTypelessTProps, uiProps?: GridProps) => {
    return create({
        type: 'Grid',
        defaultSize: 12,
        tProps: {
            ...tProps,
            skipForm: false,
        },
        uiProps,
    })
}

const createCheckBox = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormCheckBoxProps) => {
    return create({
        type: 'CheckBox',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createSlider = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormSliderProps) => {
    return create({
        type: 'Slider',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createPasswordTextBox = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormPasswordTextBoxProps) => {
    return create({
        type: 'PasswordTextBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createDoublePasswordTextBox = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormDoublePasswordTextBoxProps) => {
    return create({
        type: 'PasswordTextBox',
        defaultSize: 6,
        tProps,
        uiProps,
    })
}

const createAvatar = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormAvatarProps) => {
    return create({
        type: 'Avatar',
        defaultSize: 2,
        tProps,
        uiProps,
    })
}

const createLabel = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormLabelProps) => {
    return create({
        type: 'Label',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createContainerWithTable = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormContainerWithTableProps) => {
    return create({
        type: 'ContainerWithTable',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createMultiSelectTextBox = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormMultiSelectTextBoxProps) => {
    return create({
        type: 'MultiSelectTextBox',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

/**
 * @example
    //You only need to supply the data for the table to show.
    const data = [{a: 10, b: 20}]
    //If you don't supply the columns which is any array of texts, it will use the first object of data to create it.
    const columns = ['a', 'b']
    //Use this component only for showing simple data in a tablur manner and nothing more.
 */
const createTable = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormTableProps) => {
    return create({
        type: 'Table',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

/**
 * @example
    This is a multi select grid, it can have label or not, it can also have a confirm changes button if you pass onConfirmButtonClick
    If you don't it will change live and updates the form
    You can provide a confirmButtonProps to customize the confirm button
    If you don't provide a uniqueKey it will simply return the index of selected row which is not always reliable
    If you do provide a unique key it will use this key to pick up the value of a row as the unique key, for example uniqueKey="ID"  
 */
const createMultiSelectGrid = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormMultiSelectGridProps) => {
    return create({
        type: 'MultiSelectGrid',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createImageSelect = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormImageSelectProps) => {
    return create({
        type: 'ImageSelect',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createAdvanceStepper = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormAdvanceStepperProps) => {
    return create({
        type: 'AdvanceStepper',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createForm = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormFormProps) => {
    return create({
        type: 'Form',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createFormDialog = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormFormDialogProps) => {
    return create({
        type: 'FormDialog',
        defaultSize: 3,
        tProps: {
            ...tProps,
            wrapperRenderer: {
                ...(tProps?.wrapperRenderer || {}) as any,
                renderer: tProps?.wrapperRenderer?.renderer ?? "Button",
            },
        },
        uiProps,
    })
}

const createColorTextBox = (tProps: ATFormFieldTypelessTProps, uiProps?: ATFormColorTextBoxProps) => {
    return create({
        type: 'ColorTextBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createCustomControlledField = <C extends React.ComponentType<any>>(component: C, tProps: ATFormFieldTypelessTProps, uiProps?: ATFormCustomControlledFieldProps<React.ComponentProps<C>>) => {
    return create({
        type: 'CustomControlledField',
        defaultSize: 3,
        tProps,
        uiProps: {
            ...(uiProps || {}),
            component,
        },
    });
}

const createCustomUncontrolledField = <C extends React.ComponentType<any>>(component: C, tProps: ATFormFieldTypelessTProps, uiProps?: ATFormCustomUncontrolledFieldProps<React.ComponentProps<C>>) => {
    return create({
        type: 'CustomUncontrolledField',
        defaultSize: 3,
        tProps,
        uiProps: {
            ...(uiProps || {}),
            component,
        },
    });
}

export const formBuilder = {
    utils: formBuilderUtils,
    createTextBox,
    createIntegerTextBox,
    createFloatTextBox,
    createButton,
    createComboBox,
    createMultiComboBox,
    createDatePicker,
    createUploadButton,
    createUploadImageButton,
    createFileViewer,
    createCascadeComboBox,
    createMultiValueCascadeComboBox,
    createGrid,
    createCheckBox,
    createSlider,
    createPasswordTextBox,
    createDoublePasswordTextBox,
    createAvatar,
    createLabel,
    createContainerWithTable,
    createMultiSelectTextBox,
    createTable,
    createMultiSelectGrid,
    createImageSelect,
    createAdvanceStepper,
    createForm,
    createFormDialog,
    createColorTextBox,
    createCustomControlledField,
    createCustomUncontrolledField
}