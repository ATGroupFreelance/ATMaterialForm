import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

//Validation
import Ajv, { ErrorObject, ValidateFunction } from "ajv"
import AVJErrors from 'ajv-errors';
//Components
import { getFlatChildren, anyToFormData, formDataToAny } from './FormUtils/FormUtils';
import useATFormConfig from '@/lib/hooks/useATFormConfig/useATFormConfig';
import { ATFormChildProps, ATFormFieldTProps, ATFormChildRefInterface, ATFormOnChildChangeInterface, ATFormPendingValidationCallbackInterface, ATFormProps, ATFormResetInterface, ATFormUnknownChildProps, ATFormFieldDefInterface, ATFormOnChangeInterface } from '@/lib/types/ATForm.type';
import { ATFormContextProvider } from './ATFormContext/ATFormContext';
import ATFormTabsManager from './ATFormTabWrapper/ATFormTabsManager';
import { ATFormFormDataKeyValueType, ATFormFormDataSemiKeyValueType, ATFormFormDataType } from '@/lib/types/ATFormFormData.type';
import { createLogger } from './ATFormLogger';

interface InternalDefaultValueInterface {
    value: ATFormFormDataType | null;
    suppressFormOnChange: boolean;
}

interface LocalValueInterface {
    //Raw value assigned from props.value
    rawValue: string,
    //Value that comes from reverseConvertAny(props.value)
    value: ATFormFormDataType,
    changeID: number,
}

const ATFormFunction = (props: ATFormProps) => {
    const logger = useMemo(() => {
        return createLogger(props.logLevel, { prefix: props.debugProps?.id, preventDuplicates: true })
    }, [props.logLevel, props.debugProps?.id])

    const mChildrenRefs = useRef<Record<string, ATFormChildRefInterface>>({})
    const mFormData = useRef<ATFormFormDataType>({})
    const mFormDataKeyValue = useRef<ATFormFormDataKeyValueType>({})
    const mFormDataSemiKeyValue = useRef<ATFormFormDataSemiKeyValueType>({})
    const mLockdown = useRef<Record<string, boolean>>({})
    const mAjv = useRef<Ajv>(null)
    const mAjvValidate = useRef<ValidateFunction>(null)
    const mPrevChildren = useRef<any>(null)
    const mPendingValidationCallbacks = useRef<ATFormPendingValidationCallbackInterface[]>([])
    const { getTypeInfo, enums, rtl, getLocalText } = useATFormConfig()
    const [internalDefaultValue, setInternalDefaultValue] = React.useState<InternalDefaultValueInterface>({ value: null, suppressFormOnChange: false })
    const [isFormOnLockdown, setIsFormOnLockdown] = React.useState(false)
    const [validationErrors, setValidationErrors] = React.useState<Record<string, any> | null>(null)
    /**We make sure the default value passed using props is only called once using this flag. */
    const mIsDefaultValueResetCalledOnMount = useRef(false)
    const [localValue, setLocalValue] = useState<LocalValueInterface>({ value: {}, rawValue: "", changeID: 0 })
    const mLastValue = useRef<string>("")
    const mChildrenChangeIDMap = useRef<Record<string, number>>({})
    const mChangeID = useRef<number>(0)

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
                const tProps: ATFormFieldTProps = React.isValidElement(item) ? (item.props as ATFormFieldDefInterface)?.tProps : item.tProps

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

            logger.info('schema', schema)

            if (mAjv.current && (requiredList.length || Object.keys(properties).length))
                mAjvValidate.current = mAjv.current.compile(schema)
            else
                mAjvValidate.current = null
        }
        else
            mAjvValidate.current = null
    }, [getTypeInfo, props.validationDisabled, logger])

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
        /**Skip reseting children if defaultValue is null or undefined, this is only useful in controlled form and stop value from being overwritten at start */
        if (!internalDefaultValue.value)
            return;

        /**You do not need to pass the internal default value to reset because its being passed through props */
        for (const key in mChildrenRefs.current) {
            if (mChildrenRefs.current[key] && mChildrenRefs.current[key].reset) {
                mChildrenRefs.current[key].reset({ suppressFormOnChange: internalDefaultValue.suppressFormOnChange });
            }
        }
    }, [internalDefaultValue]);


    const onChildChange = useCallback(({ event, childProps, suppressFormOnChange, groupDataID, changeID }: ATFormOnChildChangeInterface) => {
        //TODO add support for groupDataID
        void groupDataID;

        mChildrenChangeIDMap.current[childProps.tProps.id] = changeID

        const currentChildTypeInfo = childProps.typeInfo || getTypeInfo(childProps.tProps.type)

        //New Values
        const newFormData_value = { value: event.target.value, type: childProps.tProps.type, changeID }
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

        logger.info('Form onChange (SemiKeyValue)', mFormData)

        const onChange = props.onChange

        if (onChange && !suppressFormOnChange) {
            onChange({ formData: newFormData, formDataKeyValue: newFormDataKeyValue, formDataSemiKeyValue: newFormDataSemiKeyValue })
        }
    }, [enums, getTypeInfo, props.onChange, logger])

    const getFormData = useCallback((): ATFormOnChangeInterface => {
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

    const onAssignChildRef = useCallback((id: string, childRef: ATFormChildRefInterface) => {
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

        logger.info('validation errors', {
            errors,
            normalizedErrors: result,
            formData: mFormData.current,
            formDataKeyValue: mFormDataKeyValue.current,
            formDataSemiKeyValue: mFormDataSemiKeyValue.current,
        })

        return result
    }, [getLocalText, logger])

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

    const getChildProps = useCallback((childProps: ATFormFieldDefInterface): ATFormChildProps => {
        const typeInfo = getTypeInfo(childProps.tProps.type)

        const newDefaultValue = internalDefaultValue.value?.[childProps.tProps.id]?.value === undefined ? childProps.tProps?.defaultValue : internalDefaultValue.value[childProps.tProps.id]?.value

        const isFormControlled = props.value !== undefined        

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
                debug: childProps.tProps.debug === undefined ? props.debugProps?.enabled : childProps.tProps.debug
            },
            uiProps: childProps.uiProps,
            typeInfo,
            onChildChange,
            errors: validationErrors,
            value: (childProps.tProps.id && isFormControlled) ? localValue?.value?.[childProps.tProps.id] : undefined,
            changeID: localValue?.changeID,
            isFormControlled,            
        }
    }, [getLocalText, internalDefaultValue, getTypeInfo, onChildChange, validationErrors, onAssignChildRef, localValue, props.value, props.debugProps])

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

    useEffect(() => {
        //If form is uncontrolled, skip effect
        if (props.value === undefined)
            return;

        //TODO probably best if we switch to always saving semiKeyValue
        const strValue = JSON.stringify(props.value)
        const isSameValue = mLastValue.current === strValue;

        if (isSameValue)
            return;

        mLastValue.current = strValue

        const valueFormat = props.valueFormat ?? 'FormDataSemiKeyValue'

        /**Convert any format type to FormData*/
        const formData = anyToFormData({
            value: props.value,
            enums,
            rtl,
            flatChildrenProps,
            valueFormat,
        })

        //Update changeID
        for (const key in formData) {
            const newChangeID = formData[key].changeID !== undefined ? formData[key].changeID : (mChildrenChangeIDMap.current[key] || 0) + 1

            mChildrenChangeIDMap.current[key] = newChangeID
            formData[key].changeID = newChangeID
        }

        const formDataKeyValue = formDataToAny({
            formData,
            targetFormat: 'FormDataKeyValue',
            enums,
            flatChildrenProps
        })

        const formDataSemiKeyValue = formDataToAny({
            formData,
            targetFormat: 'FormDataSemiKeyValue',
            enums,
            flatChildrenProps
        })

        mFormData.current = {
            ...formData,
        }

        mFormDataKeyValue.current = {
            ...formDataKeyValue,
        }

        mFormDataSemiKeyValue.current = {
            ...formDataSemiKeyValue
        }


        console.log('setLocalValue', formData)

        mChangeID.current = mChangeID.current + 1
        setLocalValue({ rawValue: strValue, value: formData, changeID: mChangeID.current });
    }, [props.value, props.valueFormat, enums, rtl, flatChildrenProps]);

    const reset = useCallback(({ inputDefaultValue, inputDefaultValueFormat = 'FormDataSemiKeyValue', suppressFormOnChange = false }: ATFormResetInterface = {} as ATFormResetInterface) => {
        //If default value is not key value just use it!
        const newDefaultValue = anyToFormData({
            value: inputDefaultValue,
            enums,
            rtl,
            flatChildrenProps,
            valueFormat: inputDefaultValueFormat,
        })

        console.log('newDefaultValue', newDefaultValue)

        setInternalDefaultValue({ value: newDefaultValue, suppressFormOnChange })
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
            checkValidation,
            logger,
            reset,
            getFormData
        }
    }, [onLockdownChange, isFormOnLockdown, validationErrors, getTypeInfo, checkValidation, onChildChange, logger, reset, getFormData])

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