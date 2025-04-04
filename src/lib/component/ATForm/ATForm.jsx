import React, { PureComponent, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';

//Utils
import * as FormBuilder from './FormBuilder/FormBuilder';
import * as UITypeUtils from './UITypeUtils/UITypeUtils';
//Validation
import Ajv from "ajv"
import AVJErrors from 'ajv-errors';
//Context
import ATFormContext from './ATFormContext/ATFormContext';
//Components
import ATFormRender from './ATFormRender/ATFormRender';
import TabWrapper from './TabWrapper/TabWrapper';
import { getFlatChildren } from './FormUtils/FormUtils';
import useATFormProvider from '@/lib/hooks/useATFormProvider/useATFormProvider';

const ATFormFunction = (props) => {
    const mChildrenRefs = useRef({})
    const mFormData = useRef({})
    const mFormDataKeyValue = useRef({})
    const mFormDataSemiKeyValue = useRef({})
    const mLockdown = useRef({})
    const mAjv = useRef(null)
    const mAjvValidate = useRef(null)
    const mPrevChildren = useRef(null)
    const mPendingValidationCallbacks = useRef([])
    const { customComponents, enums, rtl, getLocalText } = useATFormProvider()
    const [internalDefaultValue, setInternalDefaultValue] = React.useState({})
    const [isFormOnLockdown, setIsFormOnLockdown] = React.useState(false)
    const [validationErrors, setValidationErrors] = React.useState(null)

    useImperativeHandle(props.ref, () => {
        return {
            reset,
            checkValidation,
        }
    })

    const getTypeInfo = useCallback((type) => {
        const customTypes = customComponents ? customComponents.map(item => item.typeInfo) : null

        return UITypeUtils.getTypeInfo(type, customTypes)
    }, [customComponents])

    const compileAJV = useCallback(({ children }) => {
        if (!props.validationDisabled) {
            const flatChildren = getFlatChildren(children)

            const properties = {}
            const requiredList = []

            flatChildren.forEach(item => {
                const itemProps = React.isValidElement(item) ? item.props : item
                const { id, validation, type } = itemProps
                const typeInfo = getTypeInfo(type)

                console.log('typeInfo', { typeInfo, type, item, children })

                //skip the validation if a UI is not controlled
                if (!typeInfo.isControlledUI)
                    return;

                if (validation) {
                    const { required, ...restValidation } = validation
                    if (required)
                        requiredList.push(id)

                    const restValidationLength = Object.keys(restValidation).length

                    //if no validation properties are found try the type validation but only if an object is required
                    if (required && restValidationLength === 0) {
                        if (typeInfo.validation)
                            properties[id] = typeInfo.validation
                    }
                    else
                        properties[id] = {
                            errorMessage: 'This field can not be empty',
                            ...restValidation,
                        }
                }
            })

            const schema = {
                type: 'object',
                properties: properties,
                required: requiredList,
                // additionalProperties: false,
            }

            console.log('schema', schema)

            if (requiredList.length || Object.keys(properties).length)
                mAjvValidate.current = mAjv.current.compile(schema)
            else
                mAjvValidate.current = null
        }
        else
            mAjvValidate.current = null
    }, [getTypeInfo, props.validationDisabled])

    const reset = useCallback((inputDefaultValue, reverseConvertToKeyValueEnabled = true, isInputSemiKeyValue = false, callFormOnChangeDisabled = false) => {
        const flatChildren = getFlatChildren(props.children)

        const ungroupedInputDefaultValue = inputDefaultValue

        //If default value is not key value just use it!
        let newDefaultValue = ungroupedInputDefaultValue

        //If default value is a key value, process it so it becomes a formData format
        if (reverseConvertToKeyValueEnabled && ungroupedInputDefaultValue) {
            const reverseConvertToKeyValueDefaultValue = {}

            for (let key in ungroupedInputDefaultValue) {
                //Find the elemenet of the value using id match
                const found = flatChildren.find((item) => String(item.id) === String(key))

                //TODO HANDLE CONDITIONAL INSERT:
                //If you have used conditional insertion, in some cases, such as datepicker, this "found" variable will be null on the first run.
                //This means that the date is not reverse converted to a value, and after the condition is met, 
                //it will throw an error because the element is initialized with a value that was not reversed.
                //One easy solution is to initialize your insertion condition using a default value.
                if (found) {
                    //Find the element's type inside types which is inisde UITypeUtils, using this type we can do a reverseConvertToKeyValue
                    const foundType = getTypeInfo(found.type)

                    //if a reverseConvertToKeyValue exists, use it if not just put the value unchanged
                    if (!isInputSemiKeyValue && foundType.reverseConvertToKeyValue)
                        reverseConvertToKeyValueDefaultValue[key] = foundType.reverseConvertToKeyValue({ value: ungroupedInputDefaultValue[key], element: found, enums, rtl })
                    else if (isInputSemiKeyValue && foundType.reverseConvertToSemiKeyValue)
                        reverseConvertToKeyValueDefaultValue[key] = foundType.reverseConvertToSemiKeyValue({ value: ungroupedInputDefaultValue[key], element: found, enums, rtl })
                    else
                        reverseConvertToKeyValueDefaultValue[key] = ungroupedInputDefaultValue[key]
                }
                else
                    reverseConvertToKeyValueDefaultValue[key] = ungroupedInputDefaultValue[key]
            }

            newDefaultValue = reverseConvertToKeyValueDefaultValue
        }

        console.log('newDefaultValue', newDefaultValue)

        setInternalDefaultValue(newDefaultValue || {})
    }, [enums, getTypeInfo, props.children, rtl])

    /**In ReactJS the useEffect that comes first is called first which means this use effect is called before the compileAJV one */
    useEffect(() => {
        if (!mAjv.current) {
            mAjv.current = new Ajv({ allErrors: true })
            AVJErrors(mAjv.current)

            mAjv.current.addKeyword({
                keyword: "eachPropIsValid",
                type: "object",
                schemaType: "boolean",
                compile: () => data => {
                    let result = true

                    for (let key in data) {
                        if (data[key] === null || data[key] === undefined || data[key] === '') {
                            result = false
                            break;
                        }
                    }

                    return result
                }
            });
        }
    }, [])

    useEffect(() => {
        const oldFlatChildren = getFlatChildren(mPrevChildren.current)
        const newFlatChildren = getFlatChildren(props.children)

        if (oldFlatChildren.length !== newFlatChildren.length)
            compileAJV({ children: props.children })
        else {
            for (let i = 0; i < oldFlatChildren.length; i++) {
                if (oldFlatChildren[i].id !== newFlatChildren[i].id) {
                    compileAJV({ children: props.children })
                    break;
                }
            }
        }

        mPrevChildren.current = props.children

    }, [props.children, compileAJV])

    useEffect(() => {
        if (props.defaultValue)
            reset(props.defaultValue, true, props.isDefaultValueSemiKeyValue)
    }, [props.defaultValue, props.isDefaultValueSemiKeyValue, reset])

    useEffect(() => {
        console.log('childrenRefs', mChildrenRefs.current);
        for (let key in mChildrenRefs.current) {
            if (mChildrenRefs.current[key] && mChildrenRefs.current[key].reset) {
                mChildrenRefs.current[key].reset({ callFormOnChangeDisabled: true });
            }
        }
    }, [internalDefaultValue]); // Dependency array ensures this runs after defaultValue changes


    const onChildChange = useCallback(({ id, type, event, element, callFormOnChangeDisabled, groupDataID }) => {
        const found = getTypeInfo(type)

        //New Values
        const newFormData_value = { value: event.target.value, type: type }
        const newFormDataKeyValue_value = found.convertToKeyValue ? found.convertToKeyValue({ event, element, enums }) : event.target.value
        const newFormDataSemiKeyValue_value = found.convertToSemiKeyValue ? found.convertToSemiKeyValue({ event, element, enums }) : event.target.value

        //If we don't copy the object and directly mutate it everything will seem okay but outside the component when set state is called it will not cause reRender !, it seems even hook sestate does a casual compare 
        //and if it can't detect object change it will not render.
        const newFormData = {
            ...mFormData.current,
            [id]: newFormData_value
        }

        //If we don't copy the object and directly mutate it everything will seem okay but outside the component when set state is called it will not cause reRender !, it seems even hook sestate does a casual compare 
        //and if it can't detect object change it will not render.
        const newFormDataKeyValue = {
            ...mFormDataKeyValue.current,
            [id]: newFormDataKeyValue_value
        }

        //If we don't copy the object and directly mutate it everything will seem okay but outside the component when set state is called it will not cause reRender !, it seems even hook sestate does a casual compare 
        //and if it can't detect object change it will not render.
        const newFormDataSemiKeyValue = {
            ...mFormDataSemiKeyValue.current,
            [id]: newFormDataSemiKeyValue_value
        }

        mFormData.current = newFormData
        mFormDataKeyValue.current = newFormDataKeyValue
        mFormDataSemiKeyValue.current = newFormDataSemiKeyValue

        console.log('onChange', {
            newFormData,
            newFormDataKeyValue,
            newFormDataSemiKeyValue
        })

        const onChange = props.onChange

        if (onChange && !callFormOnChangeDisabled) {
            onChange({ formData: newFormData, formDataKeyValue: newFormDataKeyValue, formDataSemiKeyValue: newFormDataSemiKeyValue })
        }
    }, [enums, getTypeInfo, props.onChange])

    const getFormData = useCallback(() => {
        return {
            formData: {
                ...mFormData.current
            },
            formDataKeyValue: {
                ...mFormDataKeyValue.current
            },
            formDataSemiKeyValue: {
                ...mFormDataSemiKeyValue.current
            }
        }
    }, [])

    const onAssignChildRef = useCallback((id, api) => {
        mChildrenRefs.current[id] = api
    }, [])

    const ungroupFormData = useCallback((flatChildren, inputDefaultValue, reverseConvertToKeyValueEnabled, isInputSemiKeyValue) => {
        if (!inputDefaultValue)
            return inputDefaultValue;

        const groupDataIDList = flatChildren.filter(item => item.groupDataID)

        if (!groupDataIDList.length)
            return inputDefaultValue;


        const result = {}

        for (let key in inputDefaultValue) {
            if (groupDataIDList.includes(key)) {
                let subFormData = null

                //Is data formDataKeyValue format ?
                if (reverseConvertToKeyValueEnabled && !isInputSemiKeyValue)
                    subFormData = JSON.parse(inputDefaultValue[key])
                else
                    subFormData = inputDefaultValue[key]

                for (let key2 in subFormData)
                    result[key2] = subFormData[key2]
            }
            else
                result[key] = inputDefaultValue[key]
        }

        return result
    }, [])

    const onLockdownChange = useCallback((id, state) => {
        mLockdown.current[id] = state

        let result = false

        for (let key in mLockdown.current) {
            if (mLockdown.current[key] === true) {
                result = true
                break
            }
        }

        if (result !== isFormOnLockdown) {
            setIsFormOnLockdown(result)
        }
    }, [isFormOnLockdown])

    const normalizeErrors = useCallback((errors) => {
        const result = {}

        const getID = (item) => {
            const { instancePath, params } = item
            const regexResult = instancePath.match(/\/(\w*)/)

            if (regexResult && Array.isArray(regexResult) && (regexResult.length > 1))
                return regexResult[1]
            else if (params && params.missingProperty)
                return params && params.missingProperty
            else
                return null
        }

        if (errors) {
            errors.forEach(item => {
                const id = getID(item)
                if (id) {
                    result[getID(item)] = {
                        error: true,
                        ...item,
                        message: getLocalText(item.message)
                    }
                }
            })
        }

        console.log('errors', {
            errors,
            normalizedErrors: result,
            formData: mFormData.current,
            formDataKeyValue: mFormDataKeyValue.current,
            formDataSemiKeyValue: mFormDataSemiKeyValue.current,
        })

        return result
    }, [getLocalText])

    useEffect(() => {
        if (!mPendingValidationCallbacks.current.length)
            return;

        mPendingValidationCallbacks.current.forEach(item => {
            const { isValid, onValid, onInvalid } = item

            if (isValid) {
                if (onValid)
                    onValid()
            }
            else {
                if (onInvalid) {
                    onInvalid()
                }
                //Show a notification      
            }
        })

        mPendingValidationCallbacks.current = [];
    }, [validationErrors])

    const checkValidation = useCallback((onValid, onInvalid) => {
        if (mAjvValidate.current) {
            //! Important !, avjVaidate which equels the result of "this.ajv.compile(schema)" will change your input! 
            //This means this.formDataSemiKeyValue will change! and gets mutated, so make sure you copy the object and don't pass a refrence!
            const isValid = mAjvValidate.current({ ...mFormDataSemiKeyValue.current })
            const newValidationErrors = normalizeErrors(mAjvValidate.current?.errors)

            setValidationErrors(newValidationErrors)

            mPendingValidationCallbacks.current.push({ isValid, onValid, onInvalid })
        }
        else {
            if (onValid)
                onValid()
        }
    }, [normalizeErrors])

    const getChildProps = useCallback(({ id, enumsID, type, defaultValue, inputType, onClick, label, tabIndex, colDef, groupDataID, ...restProps }) => {
        const newDefaultValue = internalDefaultValue[id] === undefined ? defaultValue : internalDefaultValue[id]

        let newOnClick = onClick
        if (String(inputType).toLowerCase() === 'submit' && onClick) {
            newOnClick = (event, props) => {
                checkValidation(() => {
                    onClick(event, { ...props, formData: mFormData.current, formDataKeyValue: mFormDataKeyValue.current, formDataSemiKeyValue: mFormDataSemiKeyValue.current })
                })
            }
        }

        return {
            atFormProvidedProps: {
                onChildChange: ({ event, callFormOnChangeDisabled }) => onChildChange({ id, type, event, element: restProps, callFormOnChangeDisabled, groupDataID }),
                onLockdownChange: (state) => onLockdownChange(id, state),
                // ref: (node) => this.onAssignChildRef(id, node),
                innerRef: (node) => onAssignChildRef(id, node),
                isFormOnLockdown: isFormOnLockdown,
                inputType: inputType,
                errors: validationErrors,
                getTypeInfo: (type) => getTypeInfo(type),
                groupDataID,
            },
            id,
            type,
            defaultValue: newDefaultValue,
            label: getLocalText(id, label),
            //This is an object of props passed to form itself, the goal is to give a certain props to all the children
            ...(props.childrenProps || {}),
            ...restProps,
            onClick: newOnClick,
        }
    }, [checkValidation, getLocalText, internalDefaultValue, isFormOnLockdown, onAssignChildRef, onChildChange, onLockdownChange, validationErrors, getTypeInfo, props.childrenProps])


    const flatChildren = useMemo(() => {        
        return getFlatChildren(props.children)
    }, [props.children])

    const flatChildrenProps = flatChildren.map(item => {
        const { skipRender, tabIndex } = item?.props || item

        return {
            ...((!item?.props?.skipForm && getChildProps(item)) || {}),
            skipRender,
            tabIndex: Array.isArray(tabIndex) ? tabIndex : [tabIndex]
        }
    })

    return (
        <TabWrapper tabs={props.tabs} tabsGridProps={props.tabsGridProps} formChildrenProps={flatChildrenProps} onChange={props.onTabChange}>
            <ATFormRender>
                {flatChildren}
            </ATFormRender>
        </TabWrapper>
    )
}


export default ATFormFunction;