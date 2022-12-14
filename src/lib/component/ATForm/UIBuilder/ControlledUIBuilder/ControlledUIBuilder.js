import React, { Suspense, useState, useImperativeHandle, forwardRef, useEffect, useContext } from 'react';
//Context
import ATFormContext from '../../ATFormContext/ATFormContext';

const TextBox = React.lazy(() => import('../../UI/TextBox/TextBox'));
const ComboBox = React.lazy(() => import('../../UI/ComboBox/ComboBox'));
const MultiComboBox = React.lazy(() => import('../../UI/MultiComboBox/MultiComboBox'));
const DatePicker = React.lazy(() => import('../../UI/DatePicker/DatePicker'));
const UploadButton = React.lazy(() => import('../../UI/UploadButton/UploadButton'));
const CascadeComboBox = React.lazy(() => import('../../UI/CascadeComboBox/CascadeComboBox'));
const CheckBox = React.lazy(() => import('../../UI/CheckBox/CheckBox'));
const Slider = React.lazy(() => import('../../UI/Slider/Slider'));

const getInitialValue = (typeInfo, defaultValue) => {
    const { initialValue, isNullValueValid } = typeInfo

    let result = defaultValue

    if (defaultValue === undefined)
        result = initialValue
    else if (defaultValue === null && isNullValueValid !== true)
        result = initialValue

    return result
}

const ControlledUIBuilder = ({ _formProps_, _typeInfo_, id, type, value, defaultValue, onChange, ...restProps }, forwardedRef) => {
    const { customComponents } = useContext(ATFormContext)

    const { onChildChange, errors } = _formProps_
    const [localValue, setLocalValue] = useState(getInitialValue(_typeInfo_, defaultValue))

    useEffect(() => {
        //We call this to initialize the formData
        if (onChildChange)
            onChildChange({ event: { target: { value: localValue } } })
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (value !== undefined)
            setLocalValue(value)
    }, [value])

    useImperativeHandle(forwardedRef, () => {
        return {
            reset: reset,
        }
    })

    const reset = () => {
        internalOnChange({ target: { value: getInitialValue(_typeInfo_, defaultValue) } })
    }

    const internalOnChange = (event) => {
        setLocalValue(event.target.value)
        //This onChange must be given outside of the form to the element, the goal is total control
        if (onChange)
            onChange(event)
        //This onChange is used to update form's FormData
        if (onChildChange)
            onChildChange({ event: event })
    }


    const error = errors?.[id]?.error
    const helperText = errors?.[id]?.message

    const commonProps = {
        _formProps_: _formProps_,
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
        {type === 'ComboBox' && <ComboBox {...commonProps} />}
        {type === 'MultiComboBox' && <MultiComboBox {...commonProps} />}
        {type === 'DatePicker' && <DatePicker {...commonProps} />}
        {type === 'UploadButton' && <UploadButton {...commonProps} />}
        {type === 'CascadeComboBox' && <CascadeComboBox {...commonProps} />}
        {type === 'CheckBox' && <CheckBox {...commonProps} />}
        {type === 'Slider' && <Slider {...commonProps} />}
        {CustomComponent && <CustomComponent {...commonProps} />}
    </Suspense>
}

export default forwardRef(ControlledUIBuilder);