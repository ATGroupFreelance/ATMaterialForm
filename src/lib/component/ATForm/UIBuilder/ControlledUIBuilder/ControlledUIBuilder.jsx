import React, { Suspense, useState, useImperativeHandle, forwardRef, useEffect, useContext } from 'react';
//Context
import ATFormContext from '../../ATFormContext/ATFormContext';

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

const getInitialValue = (typeInfo, defaultValue) => {
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
const ControlledUIBuilder = ({ _formProps_, _typeInfo_, id, type, value, defaultValue, onChange, atComponentProps, ...restProps }, forwardedRef) => {
    const { customComponents } = useContext(ATFormContext)

    const { onChildChange, errors } = _formProps_
    const [localValue, setLocalValue] = useState(getInitialValue(_typeInfo_, defaultValue))

    useEffect(() => {
        //We call this to initialize the formData
        if (onChildChange)
            onChildChange({ event: { target: { value: localValue } } })
        // eslint-disable-next-line
    }, [])

    //Please note that if value is gived to an element is complex and can not be compared using a shallow compare it can cause infinite loop
    //For example a controlled Textbox from outside is okay but upload button is not.
    useEffect(() => {
        if (value !== undefined) {
            setLocalValue(value)
            //This onChange is used to update form's FormData
            if (onChildChange)
                onChildChange({ event: { target: { value: value } } })
        }
        // eslint-disable-next-line
    }, [value])

    useImperativeHandle(forwardedRef, () => {
        return {
            reset: reset,
        }
    })

    const reset = ({ callFormOnChangeDisabled }) => {
        internalOnChange({ target: { value: getInitialValue(_typeInfo_, defaultValue) } }, { callFormOnChangeDisabled })
    }

    const internalOnChange = (event, { callFormOnChangeDisabled } = {}) => {
        setLocalValue(event.target.value)
        //This onChange must be given outside of the form to the element, the goal is total control
        if (onChange)
            onChange(event)
        //This onChange is used to update form's FormData
        if (onChildChange)
            onChildChange({ event: event, callFormOnChangeDisabled })
    }


    const error = errors?.[id]?.error
    const helperText = errors?.[id]?.message

    const commonProps = {
        _formProps_: _formProps_,
        ...(atComponentProps || {}),
        ...restProps,
        id: id,
        value: localValue,
        onChange: internalOnChange,
        error: error,
        helperText: helperText,
    }

    let CustomComponent = null
    if (customComponents) {
        const found = customComponents.find(item => item.typeInfo.type === type)
        CustomComponent = found ? found.component : null
    }

    return <Suspense fallback={<div>Loading...</div>}>
        {type === 'TextBox' && <TextBox {...commonProps} />}
        {type === 'IntegerTextBox' && <IntegerTextBox {...commonProps} />}
        {type === 'FloatTextBox' && <FloatTextBox {...commonProps} />}
        {type === 'ComboBox' && <ComboBox {...commonProps} />}
        {type === 'MultiComboBox' && <MultiComboBox {...commonProps} />}
        {type === 'DatePicker' && <DatePicker {...commonProps} />}
        {type === 'UploadButton' && <UploadButton {...commonProps} />}
        {type === 'UploadImageButton' && <UploadImageButton {...commonProps} />}
        {type === 'FileViewer' && <FileViewer {...commonProps} />}        
        {type === 'CascadeComboBox' && <CascadeComboBox {...commonProps} />}
        {type === 'MultiValueCascadeComboBox' && <MultiValueCascadeComboBox {...commonProps} />}
        {type === 'CheckBox' && <CheckBox {...commonProps} />}
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

export default forwardRef(ControlledUIBuilder);