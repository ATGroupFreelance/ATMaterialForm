import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';

//Validation
import Ajv, { ErrorObject, ValidateFunction } from "ajv"
import AVJErrors from 'ajv-errors';
//Components
import { getFlatChildren } from './FormUtils/FormUtils';
import useATFormConfig from '@/lib/hooks/useATFormConfig/useATFormConfig';
import { ATFormChildProps, ATFormComponentProps, ATFormComponentRefInterface, ATFormOnChildChangeInterface, ATFormPendingValidationCallbackInterface, ATFormProps, ATFormResetInterface, ATFormUnknownChildProps } from '@/lib/types/ATForm.type';
import { ATFormContextProvider } from './ATFormContext/ATFormContext';
import { ATFormBuilderColumnInterface } from '@/lib/types/FormBuilder.type';
import ATFormTabsManager from './ATFormTabWrapper/ATFormTabsManager';

const ATFormFunction = (props: ATFormProps) => {
    const mChildrenRefs = useRef<Record<string, ATFormComponentRefInterface>>({})
    const mFormData = useRef({})
    const mFormDataKeyValue = useRef({})
    const mFormDataSemiKeyValue = useRef({})
    const mLockdown = useRef<Record<string, boolean>>({})
    const mAjv = useRef<Ajv>(null)
    const mAjvValidate = useRef<ValidateFunction>(null)
    const mPrevChildren = useRef<any>(null)
    const mPendingValidationCallbacks = useRef<ATFormPendingValidationCallbackInterface[]>([])
    const { getTypeInfo, enums, rtl, getLocalText } = useATFormConfig()
    const [internalDefaultValue, setInternalDefaultValue] = React.useState<Record<string, any>>({})
    const [isFormOnLockdown, setIsFormOnLockdown] = React.useState(false)
    const [validationErrors, setValidationErrors] = React.useState<Record<string, any> | null>(null)
    /**We make sure the default value passed using props is only called once using this flag. */
    const mIsDefaultValueResetCalledOnMount = useRef(false)

    useImperativeHandle(props.ref, () => {
        return {
            reset,
            checkValidation,
            getFormData,
        }
    })

    const compileAJV = useCallback(({ children }: any) => {
        if (!props.validationDisabled) {
            const flatChildren = getFlatChildren(children)

            const properties: Record<string, any> = {}
            const requiredList: any[] = []

            flatChildren.forEach(item => {
                const tProps: ATFormComponentProps = React.isValidElement(item) ? (item.props as ATFormBuilderColumnInterface)?.tProps : item.tProps

                const typeInfo = getTypeInfo(tProps?.type)

                if (!typeInfo)
                    return;

                //skip the validation if a UI is not controlled
                if (!typeInfo.isControlledUI)
                    return;

                if (tProps.validation) {
                    const { required, ...restValidation } = tProps.validation
                    if (required)
                        requiredList.push(tProps.id)

                    const restValidationLength = Object.keys(restValidation).length

                    //if no validation properties are found try the type validation but only if an object is required
                    if (required && restValidationLength === 0) {
                        if (typeInfo.validation)
                            properties[tProps.id] = typeInfo.validation
                    }
                    else
                        properties[tProps.id] = {
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

            if (mAjv.current && (requiredList.length || Object.keys(properties).length))
                mAjvValidate.current = mAjv.current.compile(schema)
            else
                mAjvValidate.current = null
        }
        else
            mAjvValidate.current = null
    }, [getTypeInfo, props.validationDisabled])

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

                    for (const key in data) {
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
        console.log('internalDefaultValue has changed', { internalDefaultValue, refList: mChildrenRefs.current })
        for (const key in mChildrenRefs.current) {
            if (mChildrenRefs.current[key] && mChildrenRefs.current[key].reset) {
                mChildrenRefs.current[key].reset();
            }
        }
    }, [internalDefaultValue]); // Dependency array ensures this runs after defaultValue changes


    const onChildChange = useCallback(({ event, childProps, callFormOnChangeDisabled, groupDataID }: ATFormOnChildChangeInterface) => {
        //TODO add support for groupDataID
        void groupDataID;

        const currentChildTypeInfo = childProps.typeInfo || getTypeInfo(childProps.tProps.type)

        //New Values
        const newFormData_value = { value: event.target.value, type: childProps.tProps.type }
        const newFormDataKeyValue_value = currentChildTypeInfo?.convertToKeyValue ? currentChildTypeInfo.convertToKeyValue({ event, childProps, enums }) : event.target.value
        const newFormDataSemiKeyValue_value = currentChildTypeInfo?.convertToSemiKeyValue ? currentChildTypeInfo.convertToSemiKeyValue({ event, childProps, enums }) : event.target.value

        //If we don't copy the object and directly mutate it everything will seem okay but outside the component when set state is called it will not cause reRender !, it seems even hook sestate does a casual compare 
        //and if it can't detect object change it will not render.
        const newFormData = {
            ...mFormData.current,
            [childProps.tProps.id]: newFormData_value
        }

        //If we don't copy the object and directly mutate it everything will seem okay but outside the component when set state is called it will not cause reRender !, it seems even hook sestate does a casual compare 
        //and if it can't detect object change it will not render.
        const newFormDataKeyValue = {
            ...mFormDataKeyValue.current,
            [childProps.tProps.id]: newFormDataKeyValue_value
        }

        //If we don't copy the object and directly mutate it everything will seem okay but outside the component when set state is called it will not cause reRender !, it seems even hook sestate does a casual compare 
        //and if it can't detect object change it will not render.
        const newFormDataSemiKeyValue = {
            ...mFormDataSemiKeyValue.current,
            [childProps.tProps.id]: newFormDataSemiKeyValue_value
        }

        mFormData.current = newFormData
        mFormDataKeyValue.current = newFormDataKeyValue
        mFormDataSemiKeyValue.current = newFormDataSemiKeyValue

        console.log('onChange', {
            newFormData,
            newFormDataKeyValue,
            newFormDataSemiKeyValue,
            callFormOnChangeDisabled,
            onChange: props.onChange
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

    const onAssignChildRef = useCallback((id: string, childRef: ATFormComponentRefInterface) => {
        mChildrenRefs.current[id] = childRef
    }, [])

    // const ungroupFormData = useCallback((flatChildren, inputDefaultValue, reverseConvertToKeyValueEnabled, isInputSemiKeyValue) => {
    //     if (!inputDefaultValue)
    //         return inputDefaultValue;

    //     const groupDataIDList = flatChildren.filter(item => item.groupDataID)

    //     if (!groupDataIDList.length)
    //         return inputDefaultValue;


    //     const result = {}

    //     for (let key in inputDefaultValue) {
    //         if (groupDataIDList.includes(key)) {
    //             let subFormData = null

    //             //Is data formDataKeyValue format ?
    //             if (reverseConvertToKeyValueEnabled && !isInputSemiKeyValue)
    //                 subFormData = JSON.parse(inputDefaultValue[key])
    //             else
    //                 subFormData = inputDefaultValue[key]

    //             for (let key2 in subFormData)
    //                 result[key2] = subFormData[key2]
    //         }
    //         else
    //             result[key] = inputDefaultValue[key]
    //     }

    //     return result
    // }, [])

    const onLockdownChange = useCallback((id: string, state: boolean) => {
        mLockdown.current[id] = state

        let result = false

        for (const key in mLockdown.current) {
            if (mLockdown.current[key] === true) {
                result = true
                break
            }
        }

        if (result !== isFormOnLockdown) {
            setIsFormOnLockdown(result)
        }
    }, [isFormOnLockdown])

    const normalizeErrors = useCallback((errors: null | ErrorObject[]) => {
        const result: Record<string, any> = {}

        const getID = (item: ErrorObject) => {
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
            errors.forEach((item: ErrorObject) => {
                const id = getID(item)

                if (id) {
                    result[id] = {
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

    const checkValidation = useCallback((onValid: any, onInvalid?: any) => {
        if (mAjvValidate.current) {
            //! Important !, avjVaidate which equels the result of "this.ajv.compile(schema)" will change your input! 
            //This means this.formDataSemiKeyValue will change! and gets mutated, so make sure you copy the object and don't pass a refrence!
            const isValid = mAjvValidate.current({ ...mFormDataSemiKeyValue.current })
            const newValidationErrors = normalizeErrors(mAjvValidate.current?.errors ?? null)

            setValidationErrors(newValidationErrors)

            const newPendingValidationCallbacks: ATFormPendingValidationCallbackInterface = {
                isValid,
                onValid,
                onInvalid
            }

            mPendingValidationCallbacks.current.push(newPendingValidationCallbacks)
        }
        else {
            if (onValid)
                onValid()
        }
    }, [normalizeErrors])

    const getChildProps = useCallback((childProps: ATFormBuilderColumnInterface): ATFormChildProps => {
        const typeInfo = getTypeInfo(childProps.tProps.type)

        const newDefaultValue = internalDefaultValue[childProps.tProps.id] === undefined ? childProps.tProps?.defaultValue : internalDefaultValue[childProps.tProps.id]

        return {
            tProps: {
                ...childProps.tProps,
                label: childProps.tProps.label !== undefined ? childProps.tProps.label : getLocalText(childProps.tProps.id, childProps.tProps.id),
                defaultValue: newDefaultValue,
                ref: (newRef) => {
                    if (newRef) {
                        onAssignChildRef(childProps.tProps.id, newRef)

                        const ref = childProps.tProps.ref;
                        if (typeof ref === 'function') {
                            ref(newRef);
                        } else if (ref && typeof ref === 'object' && 'current' in ref) {
                            ref.current = newRef;
                        }
                    }
                },
            },
            uiProps: childProps.uiProps,
            typeInfo,
            onChildChange,
            errors: validationErrors,
        }
    }, [getLocalText, internalDefaultValue, getTypeInfo, onChildChange, validationErrors, onAssignChildRef])

    const [flatChildren, flatChildrenProps] = useMemo(() => {
        const flatChildren = getFlatChildren(props.children)

        const flatChildrenProps: (ATFormChildProps | ATFormUnknownChildProps)[] = flatChildren.map(item => {
            const { tProps, ...restProps } = item?.props || item

            const isUnknownChild = !tProps || !getTypeInfo(tProps.type)

            /**Handle unknown child or child that skip the form, these childs are only rendered as they are and only use the tab system */
            if (isUnknownChild)
                return {
                    tProps,
                    uiProps: restProps,
                } as ATFormUnknownChildProps
            else {
                return getChildProps(item)
            }
        })

        return [flatChildren, flatChildrenProps]
    }, [props.children, getChildProps, getTypeInfo])

    const reset = useCallback(({ inputDefaultValue, reverseConvertToKeyValueEnabled = true, inputDefaultValueFormat = 'FormDataSemiKeyValue', callFormOnChangeDisabled = false }: ATFormResetInterface = {} as ATFormResetInterface) => {
        //TODO handle callFormOnChangeDisabled;
        void callFormOnChangeDisabled;

        const ungroupedInputDefaultValue = inputDefaultValue

        //If default value is not key value just use it!
        let newDefaultValue = ungroupedInputDefaultValue

        //If default value is a key value, process it so it becomes a formData format
        if (reverseConvertToKeyValueEnabled && ungroupedInputDefaultValue) {
            const reverseConvertToKeyValueDefaultValue: Record<string, any> = {}

            for (const key in ungroupedInputDefaultValue) {
                //Find the elemenet of the value using id match
                const foundChildProps = flatChildrenProps.find((item) => String(item.tProps?.id) === String(key))

                //TODO HANDLE CONDITIONAL INSERT:
                //If you have used conditional insertion, in some cases, such as datepicker, this "found" variable will be null on the first run.
                //This means that the date is not reverse converted to a value, and after the condition is met, 
                //it will throw an error because the element is initialized with a value that was not reversed.
                //One easy solution is to initialize your insertion condition using a default value.
                if (foundChildProps) {
                    //Find the element's type inside types which is inisde UITypeUtils, using this type we can do a reverseConvertToKeyValue
                    const typeInfo = (foundChildProps as ATFormChildProps)?.typeInfo

                    if (!typeInfo) {
                        console.warn('Type not found, child props is for an uknown child', { foundChildProps, id: key })
                        return reverseConvertToKeyValueDefaultValue[key] = ungroupedInputDefaultValue[key]
                    }

                    /**Because typeInfo exists we are sure its a ATFormChildProps */
                    const childProps = foundChildProps as ATFormChildProps

                    //if a reverseConvertToKeyValue exists, use it if not just put the value unchanged
                    if (inputDefaultValueFormat === 'FormDataKeyValue' && typeInfo.reverseConvertToKeyValue)
                        reverseConvertToKeyValueDefaultValue[key] = typeInfo.reverseConvertToKeyValue({ value: ungroupedInputDefaultValue[key], childProps, enums, rtl })
                    else if (inputDefaultValueFormat === 'FormDataSemiKeyValue' && typeInfo.reverseConvertToSemiKeyValue)
                        reverseConvertToKeyValueDefaultValue[key] = typeInfo.reverseConvertToSemiKeyValue({ value: ungroupedInputDefaultValue[key], childProps, enums, rtl })
                    else
                        reverseConvertToKeyValueDefaultValue[key] = ungroupedInputDefaultValue[key]
                }
                else
                    reverseConvertToKeyValueDefaultValue[key] = ungroupedInputDefaultValue[key]
            }

            newDefaultValue = reverseConvertToKeyValueDefaultValue
        }

        console.log('reset newDefaultValue', newDefaultValue)

        setInternalDefaultValue(newDefaultValue || {})
    }, [enums, rtl, flatChildrenProps])

    useEffect(() => {
        if (props.defaultValue && !mIsDefaultValueResetCalledOnMount.current) {
            reset({ inputDefaultValue: props.defaultValue, inputDefaultValueFormat: props.defaultValueFormat })
            mIsDefaultValueResetCalledOnMount.current = true
        }
    }, [props.defaultValue, props.defaultValueFormat, reset])

    const formContextValue = useMemo(() => {
        return {
            onChildChange,
            onLockdownChange,
            isFormOnLockdown,
            errors: validationErrors,
            getTypeInfo,
            checkValidation
        }
    }, [onLockdownChange, isFormOnLockdown, validationErrors, getTypeInfo, checkValidation, onChildChange])

    return (
        <ATFormContextProvider value={formContextValue}>
            <ATFormTabsManager
                tabs={props.tabs}
                childrenProps={flatChildrenProps}
                onChange={props.onTabChange}
                defaultSelectedTabPaths={props.defaultSelectedTabPaths}
            >
                {flatChildren}
            </ATFormTabsManager>
        </ATFormContextProvider>
    )
}


export default ATFormFunction;