import React, { Suspense, useState, useImperativeHandle, useEffect, useRef } from 'react';
//Context
import useATFormConfig from '../../../../hooks/useATFormConfig/useATFormConfig';
import { ATControlledUIBuilderProps, ATFormChildResetInterface } from '@/lib/types/ATForm.type';
import { ATFormTypeInfoInterface } from '@/lib/types/UITypeUtils.type';
import { ATFormComboBoxProps } from '@/lib/types/ui/ComboBox.type';
import { ATFormMultiComboBoxProps } from '@/lib/types/ui/MultiComboBox.type';
import { ATFormFileViewerProps } from '@/lib/types/ui/FileViewer.type';
import { ATFormCheckBoxProps } from '@/lib/types/ui/CheckBox.type';

const TextBox = React.lazy(() => import('../../UI/TextBox/TextBox'));
const IntegerTextBox = React.lazy(() => import('../../UI/IntegerTextBox/IntegerTextBox'));
const FloatTextBox = React.lazy(() => import('../../UI/FloatTextBox/FloatTextBox'));
const ComboBox = React.lazy(() => import('../../UI/ComboBox/ComboBox'));
const MultiComboBox = React.lazy(() => import('../../UI/MultiComboBox/MultiComboBox'));
const DatePicker = React.lazy(() => import('../../UI/DatePicker/DatePicker'));
const UploadButton = React.lazy(() => import('../../UI/UploadButton/UploadButton'));
const UploadImageButton = React.lazy(() => import('../../UI/UploadImageButton/UploadImageButton'));
const FileViewer = React.lazy(() => import('../../UI/FileViewer/FileViewer'));
const CascadeComboBox = React.lazy(() => import('../../UI/CascadeComboBox/CascadeComboBox'));
const MultiValueCascadeComboBox = React.lazy(() => import('../../UI/MultiValueCascadeComboBox/MultiValueCascadeComboBox'));
const CheckBox = React.lazy(() => import('../../UI/CheckBox/CheckBox'));
const Slider = React.lazy(() => import('../../UI/Slider/Slider'));
const PasswordTextBox = React.lazy(() => import('../../UI/PasswordTextBox/PasswordTextBox'));
const DoublePasswordTextBox = React.lazy(() => import('../../UI/DoublePasswordTextBox/DoublePasswordTextBox'));
const Avatar = React.lazy(() => import('../../UI/Avatar/Avatar'));
const ContainerWithTable = React.lazy(() => import('../../UI/ContainerWithTable/ContainerWithTable'));
const MultiSelectTextBox = React.lazy(() => import('../../UI/MultiSelectTextBox/MultiSelectTextBox'));
const MultiSelectGrid = React.lazy(() => import('../../UI/MultiSelectGrid/MultiSelectGrid'));
const ImageSelect = React.lazy(() => import('../../UI/ImageSelect/ImageSelect'));
const AdvanceStepper = React.lazy(() => import('../../UI/AdvanceStepper/AdvanceStepper'));
const Form = React.lazy(() => import('../../UI/Form/Form'));
const ColorTextBox = React.lazy(() => import('../../UI/ColorTextBox/ColorTextBox'));

const getInitialValue = (typeInfo: ATFormTypeInfoInterface, defaultValue: any) => {
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
const ControlledUIBuilder = ({ childProps }: ATControlledUIBuilderProps) => {
    const mIsInitialized = useRef(false)
    const { customComponents } = useATFormConfig()

    /**UI Builder doesn't allow any child with an undefined typeinfo to be rendered which means typeinfo is for sure not empty*/
    const [localValue, setLocalValue] = useState(getInitialValue(childProps.typeInfo!, childProps.tProps?.defaultValue))

    useEffect(() => {
        if (!mIsInitialized.current) {
            mIsInitialized.current = true

            //We call this to initialize the formData        
            childProps.onChildChange({
                event: { target: { value: localValue } },
                childProps,
            })
        }
    }, [childProps, localValue])

    //Please note that if value is gived to an element is complex and can not be compared using a shallow compare it can cause infinite loop
    //For example a controlled Textbox from outside is okay but upload button is not.
    useEffect(() => {
        if (childProps.uiProps?.value !== undefined) {
            setLocalValue(childProps.uiProps?.value)
            //This onChange is used to update form's FormData            
            childProps.onChildChange({
                event: { target: { value: childProps.uiProps.value } },
                childProps,
            })
        }
        // eslint-disable-next-line
    }, [childProps.uiProps?.value])

    useImperativeHandle(childProps.tProps.ref, () => {
        return {
            reset: reset,
        }
    })

    const reset = ({ callFormOnChangeDisabled = false }: ATFormChildResetInterface = {} as ATFormChildResetInterface) => {
        internalOnChange({ target: { value: getInitialValue(childProps.typeInfo!, childProps.tProps?.defaultValue) } }, { callFormOnChangeDisabled })
    }

    const internalOnChange = (event: any, props?: ATFormChildResetInterface) => {
        setLocalValue(event.target.value)
        //This onChange must be given outside of the form to the element, the goal is total control
        if (childProps.uiProps?.onChange)
            childProps.uiProps.onChange(event)
        //This onChange is used to update form's FormData        
        childProps.onChildChange({ event, callFormOnChangeDisabled: props?.callFormOnChangeDisabled, childProps })
    }


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

    console.log('Controlled UIBuilder children', childProps)

    return <Suspense fallback={<div>Loading...</div>}>
        {type === 'TextBox' && <TextBox {...commonProps} />}
        {type === 'IntegerTextBox' && <IntegerTextBox {...commonProps} />}
        {type === 'FloatTextBox' && <FloatTextBox {...commonProps} />}
        {type === 'ComboBox' && <ComboBox {...commonProps as ATFormComboBoxProps} />}
        {type === 'MultiComboBox' && <MultiComboBox {...commonProps as ATFormMultiComboBoxProps} />}
        {type === 'DatePicker' && <DatePicker {...commonProps} />}
        {type === 'UploadButton' && <UploadButton {...commonProps} />}
        {type === 'UploadImageButton' && <UploadImageButton {...commonProps} />}
        {type === 'FileViewer' && <FileViewer {...commonProps as unknown as ATFormFileViewerProps} />}
        {type === 'CascadeComboBox' && <CascadeComboBox {...commonProps} />}
        {type === 'MultiValueCascadeComboBox' && <MultiValueCascadeComboBox {...commonProps} />}
        {type === 'CheckBox' && <CheckBox {...commonProps as ATFormCheckBoxProps} />}
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
        {type === 'ColorTextBox' && <ColorTextBox {...commonProps} />}
        {CustomComponent && <CustomComponent {...commonProps} />}
    </Suspense>
}

export default ControlledUIBuilder;