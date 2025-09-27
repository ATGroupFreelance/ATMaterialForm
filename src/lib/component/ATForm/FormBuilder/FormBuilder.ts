import { ATFormBuilderCreateInterface, ATFormFieldTypelessTProps } from "../../../types/FormBuilder.type";

import { ATFormTextBoxProps } from "../../../types/ui/TextBox.type";
import { ATFormIntegerTextBoxProps } from "@/lib/types/ui/IntegerTextBox.type";
import { ATFormFloatTextBoxProps } from "@/lib/types/ui/FloatTextBox.type";
import { ATFormButtonProps } from "@/lib/types/ui/Button.type";
import { ATFormComboBoxProps } from "@/lib/types/ui/ComboBox.type";
import { ATFormMultiComboBoxProps } from "@/lib/types/ui/MultiComboBox.type";
import { ATFormDatePickerProps } from "@/lib/types/ui/DatePicker.type";
import { ATFormUploadButtonProps } from "@/lib/types/ui/UploadButton.type";
import { ATFormUploadImageButtonProps } from "@/lib/types/ui/UploadImageButton.type";
import { ATFormFileViewerProps } from "@/lib/types/ui/FileViewer.type";
import { ATFormCascadeComboBoxProps } from "@/lib/types/ui/CascadeComboBox.type";
import { ATFormMultiValueCascadeComboBoxProps } from "@/lib/types/ui/MultiValueCascadeComboBox.type";
import { GridProps } from "@mui/material";
import { ATFormCheckBoxProps } from "@/lib/types/ui/CheckBox.type";
import { ATFormSliderProps } from "@/lib/types/ui/Slider.type";
import { ATFormPasswordTextBoxProps } from "@/lib/types/ui/PasswordTextBox.type";
import { ATFormDoublePasswordTextBoxProps } from "@/lib/types/ui/DoublePasswordTextBox.type";
import { ATFormAvatarProps } from "@/lib/types/ui/Avatar.type";
import { ATFormLabelProps } from "@/lib/types/ui/Label.type";
import { ATFormMultiSelectTextBoxProps } from "@/lib/types/ui/MultiSelectTextBox.type";
import { ATFormTableProps } from "@/lib/types/ui/Table.type";
import { ATFormImageSelectProps } from "@/lib/types/ui/ImageSelect.type";
import { ATFormAdvanceStepperProps } from "@/lib/types/ui/AdvanceStepper.type";
import { ATFormFormProps } from "@/lib/types/ui/Form.type";
import { ATFormColorTextBoxProps } from "@/lib/types/ui/ColorTextBox.type";
import { ATFormContainerWithTableProps } from "@/lib/types/ui/ContainerWithTable.type";
import { ATFormMultiSelectGridProps } from "@/lib/types/ui/MultiSelectGrid.type";
import { ATFormFieldDefInterface } from "@/lib/types/ATForm.type";
import { formBuilderUtils } from "./FormBuilderUtils";
import { ATFormFormDialogProps } from "@/lib/types/ui/FormDialog.type";
import { ATFormCustomControlledFieldProps } from "@/lib/types/ui/CustomControlledField.type";
import { ATFormCustomUncontrolledFieldProps } from "@/lib/types/ui/CustomUncontrolledField.type";

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
            skipRender: true,
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