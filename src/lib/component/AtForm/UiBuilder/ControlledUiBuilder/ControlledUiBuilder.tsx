import React, { Suspense, useState, useImperativeHandle, useEffect, useRef } from 'react';
//Context
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';
import { AtControlledUiBuilderProps, AtFormChildResetInterface, AtFormChildSetValueInterface } from '../../../../types/AtForm.type';
import { AtFormTypeInfoInterface } from '../../../../types/UiTypeUtils.type';
import { AtFormComboBoxProps } from '../../../../types/ui/ComboBox.type';
import { AtFormMultiComboBoxProps } from '../../../../types/ui/MultiComboBox.type';
import { AtFormFileViewerProps } from '../../../../types/ui/FileViewer.type';
import { AtFormCheckBoxProps } from '../../../../types/ui/CheckBox.type';
import { AtFormCustomControlledFieldProps } from '../../../../types/ui/CustomControlledField.type';

const TextBox = React.lazy(() => import('../../Ui/TextBox/TextBox'));
const IntegerTextBox = React.lazy(() => import('../../Ui/IntegerTextBox/IntegerTextBox'));
const FloatTextBox = React.lazy(() => import('../../Ui/FloatTextBox/FloatTextBox'));
const ComboBox = React.lazy(() => import('../../Ui/ComboBox/ComboBox'));
const MultiComboBox = React.lazy(() => import('../../Ui/MultiComboBox/MultiComboBox'));
const DatePicker = React.lazy(() => import('../../Ui/DatePicker/DatePicker'));
const UploadButton = React.lazy(() => import('../../Ui/UploadButton/UploadButton'));
const UploadImageButton = React.lazy(() => import('../../Ui/UploadImageButton/UploadImageButton'));
const FileViewer = React.lazy(() => import('../../Ui/FileViewer/FileViewer'));
const CascadeComboBox = React.lazy(() => import('../../Ui/CascadeComboBox/CascadeComboBox'));
const MultiValueCascadeComboBox = React.lazy(() => import('../../Ui/MultiValueCascadeComboBox/MultiValueCascadeComboBox'));
const CheckBox = React.lazy(() => import('../../Ui/CheckBox/CheckBox'));
const Slider = React.lazy(() => import('../../Ui/Slider/Slider'));
const PasswordTextBox = React.lazy(() => import('../../Ui/PasswordTextBox/PasswordTextBox'));
const DoublePasswordTextBox = React.lazy(() => import('../../Ui/DoublePasswordTextBox/DoublePasswordTextBox'));
const Avatar = React.lazy(() => import('../../Ui/Avatar/Avatar'));
const ContainerWithTable = React.lazy(() => import('../../Ui/ContainerWithTable/ContainerWithTable'));
const MultiSelectTextBox = React.lazy(() => import('../../Ui/MultiSelectTextBox/MultiSelectTextBox'));
const MultiSelectGrid = React.lazy(() => import('../../Ui/MultiSelectGrid/MultiSelectGrid'));
const ImageSelect = React.lazy(() => import('../../Ui/ImageSelect/ImageSelect'));
const AdvanceStepper = React.lazy(() => import('../../Ui/AdvanceStepper/AdvanceStepper'));
const Form = React.lazy(() => import('../../Ui/Form/Form'));
const FormDialog = React.lazy(() => import('../../Ui/FormDialog/FormDialog'));
const ColorTextBox = React.lazy(() => import('../../Ui/ColorTextBox/ColorTextBox'));
const CardSelect = React.lazy(() => import('../../Ui/CardSelect/CardSelect'));
const CustomControlledField = React.lazy(() => import('../../Ui/CustomControlledField/CustomControlledField'));

export const getInitialValue = (typeInfo: AtFormTypeInfoInterface, defaultValue: any) => {
    const { initialValue, isNullValueValid } = typeInfo

    let result = defaultValue

    if (defaultValue === undefined)
        result = initialValue
    else if (defaultValue === null && isNullValueValid !== true)
        result = initialValue

    return result
}

//Sometimes you might want to pass a prop to a component that is already taken, that is when you use the atComponentProps, an example would be type: number for textfield
//which is already taken by ATMaterialForm
const ControlledUiBuilder = ({ childProps }: AtControlledUiBuilderProps) => {
    const mIsInitialized = useRef(childProps.isFormControlled ? true : false)
    const { customComponents } = useAtFormConfig()
    const mChangeId = useRef<number>(0)
    const mLastAppliedParentChangeId = useRef<number>(-1)

    /**UI Builder doesn't allow any child with an undefined typeinfo to be rendered which means typeinfo is for sure not empty*/
    const [localValue, setLocalValue] = useState(getInitialValue(childProps.typeInfo!, childProps.tProps?.defaultValue))

    useEffect(() => {
        if (!mIsInitialized.current) {
            mIsInitialized.current = true

            //We call this to initialize the formData        
            childProps.onChildChange({
                event: { target: { value: localValue } },
                childProps,
                changeId: mChangeId.current
            })
        }
    }, [childProps, localValue])

    useEffect(() => {
        if (!childProps.isFormControlled)
            return;

        if (mLastAppliedParentChangeId.current >= childProps.changeId)
            return;

        mLastAppliedParentChangeId.current = childProps.changeId

        if (childProps.value?.value === undefined) {
            const initValue = getInitialValue(childProps.typeInfo!, childProps.tProps?.defaultValue)
            setLocalValue(initValue)

            return;
        }
        else {
            if (childProps.value?.changeId !== undefined && childProps.value.changeId <= mChangeId.current)
                return;

            setLocalValue(childProps.value.value)

            //If parent's changeID does not exist we assume its a new value and we increase the changeID
            if (childProps.value?.changeId !== undefined)
                mChangeId.current = childProps.value.changeId
        }
    }, [childProps])

    //Please note that if value is gived to an element is complex and can not be compared using a shallow compare it can cause infinite loop
    //For example a controlled Textbox from outside is okay but upload button is not.
    useEffect(() => {
        if (childProps.uiProps?.value !== undefined) {
            setLocalValue(childProps.uiProps?.value)
            //This onChange is used to update form's FormData            
            childProps.onChildChange({
                event: { target: { value: childProps.uiProps.value } },
                childProps,
                changeId: mChangeId.current
            })
        }
        // eslint-disable-next-line
    }, [childProps.uiProps?.value])

    const internalOnChange = (event: any, props?: AtFormChildResetInterface) => {
        //When child is controlled the change will cause the single true value to change which will reach here throgh the parent and finally changes localValue
        // if (!childProps.isFormControlled)
        setLocalValue(event.target.value)

        if (childProps.isFormControlled)
            mChangeId.current = mChangeId.current + 1

        //This onChange must be given outside of the form to the element, the goal is total control
        if (childProps.uiProps?.onChange)
            childProps.uiProps.onChange(event)
        //This onChange is used to update form's FormData        
        childProps.onChildChange({ event, suppressFormOnChange: props?.suppressFormOnChange, childProps, changeId: mChangeId.current })
    }

    const reset = ({ suppressFormOnChange = false }: AtFormChildResetInterface = {} as AtFormChildResetInterface) => {
        internalOnChange({ target: { value: getInitialValue(childProps.typeInfo!, childProps.tProps?.defaultValue) } }, { suppressFormOnChange })
    }

    const getValue = () => {
        return localValue;
    }

    const setValue = ({ value, suppressFormOnChange = false }: AtFormChildSetValueInterface) => {
        /*
         * Programmatically update only this field.
         *
         * We intentionally reuse internalOnChange so the field's local state,
         * AtForm data representations and normal change pipeline stay in sync.
         *
         * Crucially, this does not reset any sibling fields.
         */
        internalOnChange(
            { target: { value } },
            { suppressFormOnChange }
        );
    }

    useImperativeHandle(childProps.tProps.ref, () => {
        return {
            reset,
            getValue,
            setValue,
        }
    })

    const error = childProps.errors?.[childProps.tProps.id]?.error
    const helperText = childProps.errors?.[childProps.tProps.id]?.message

    const commonProps = {
        id: childProps.tProps.id,
        /**Please note value and onChange that might be inside uiProps are overwritten but are called inside the internal functions */
        ...childProps.uiProps,
        value: localValue,
        onChange: (event: any) => internalOnChange(event),
        error: error,
        helperText: helperText,
        label: childProps.uiProps?.label !== undefined ? childProps.uiProps.label : childProps.tProps.label
    }

    let CustomComponent = null
    if (customComponents) {
        const found = customComponents.find((item: any) => item.typeInfo.type === childProps.typeInfo!.type)
        CustomComponent = found ? found.component : null
    }

    const type = childProps.tProps.type

    return <Suspense fallback={<div>Loading...</div>}>
        {type === 'TextBox' && <TextBox {...commonProps} />}
        {type === 'IntegerTextBox' && <IntegerTextBox {...commonProps} />}
        {type === 'FloatTextBox' && <FloatTextBox {...commonProps} />}
        {type === 'ComboBox' && <ComboBox {...commonProps as AtFormComboBoxProps} />}
        {type === 'MultiComboBox' && <MultiComboBox {...commonProps as AtFormMultiComboBoxProps} />}
        {type === 'DatePicker' && <DatePicker {...commonProps} />}
        {type === 'UploadButton' && <UploadButton {...commonProps} />}
        {type === 'UploadImageButton' && <UploadImageButton {...commonProps} />}
        {type === 'FileViewer' && <FileViewer {...commonProps as unknown as AtFormFileViewerProps} />}
        {type === 'CascadeComboBox' && <CascadeComboBox {...commonProps} />}
        {type === 'MultiValueCascadeComboBox' && <MultiValueCascadeComboBox {...commonProps} />}
        {type === 'CheckBox' && <CheckBox {...commonProps as AtFormCheckBoxProps} />}
        {type === 'Slider' && <Slider {...commonProps} />}
        {type === 'PasswordTextBox' && <PasswordTextBox {...commonProps} />}
        {type === 'DoublePasswordTextBox' && <DoublePasswordTextBox {...commonProps} />}
        {type === 'Avatar' && <Avatar {...commonProps} />}
        {type === 'ContainerWithTable' && <ContainerWithTable {...commonProps} />}
        {type === 'MultiSelectTextBox' && <MultiSelectTextBox {...commonProps} />}
        {type === 'MultiSelectGrid' && <MultiSelectGrid {...commonProps} />}
        {type === 'ImageSelect' && <ImageSelect {...commonProps} />}
        {type === 'AdvanceStepper' && <AdvanceStepper {...commonProps} />}
        {type === 'Form' && <Form {...commonProps} />}
        {type === 'FormDialog' && <FormDialog {...commonProps} />}
        {type === 'ColorTextBox' && <ColorTextBox {...commonProps} />}
        {type === 'CardSelect' && <CardSelect {...commonProps} />}
        {type === 'CustomControlledField' && <CustomControlledField {...commonProps as unknown as AtFormCustomControlledFieldProps} />}
        {CustomComponent && <CustomComponent {...commonProps} />}
    </Suspense>
}

export default ControlledUiBuilder;