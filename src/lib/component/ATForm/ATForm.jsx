import React, { PureComponent } from 'react';

// //Utils
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

class ATForm extends PureComponent {
    constructor(props) {
        super(props)

        this.childrenRefs = {}
        this.formData = {}
        this.formDataKeyValue = {}
        this.formDataSemiKeyValue = {}
        this.lockdown = {}
        this.ajv = new Ajv({ allErrors: true })
        AVJErrors(this.ajv)

        this.ajv.addKeyword({
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

        this.ajvValidate = null
    }

    componentDidMount() {
        this.compileAJV()

        if (this.props.defaultValue)
            this.reset(this.props.defaultValue, true, this.props.isDefaultValueSemiKeyValue)
    }

    componentDidUpdate(prevProps) {
        const oldFlatChildren = getFlatChildren(prevProps.children)
        const newFlatChildren = getFlatChildren(this.props.children)

        if (oldFlatChildren.length !== newFlatChildren.length)
            this.compileAJV()
        else {
            for (let i = 0; i < oldFlatChildren.length; i++) {
                if (oldFlatChildren[i].id !== newFlatChildren[i].id) {
                    this.compileAJV()
                    break;
                }
            }
        }
    }

    state = {
        defaultValue: {},
        isFormOnLockdown: false,
        validationErrors: null,
    }

    getTypeInfo = (type) => {
        const customTypes = this.context.customComponents ? this.context.customComponents.map(item => item.typeInfo) : null

        return UITypeUtils.getTypeInfo(type, customTypes)
    }

    onChildChange = ({ id, type, event, element, callFormOnChangeDisabled, groupDataID }) => {
        const { enums } = this.context
        const found = this.getTypeInfo(type)

        //New Values
        const newFormData_value = { value: event.target.value, type: type }
        const newFormDataKeyValue_value = found.convertToKeyValue ? found.convertToKeyValue({ event, element, enums }) : event.target.value
        const newFormDataSemiKeyValue_value = found.convertToSemiKeyValue ? found.convertToSemiKeyValue({ event, element, enums }) : event.target.value

        //If we don't copy the object and directly mutate it everything will seem okay but outside the component when set state is called it will not cause reRender !, it seems even hook sestate does a casual compare 
        //and if it can't detect object change it will not render.
        const newFormData = {
            ...this.formData,
            [id]: newFormData_value
        }

        //If we don't copy the object and directly mutate it everything will seem okay but outside the component when set state is called it will not cause reRender !, it seems even hook sestate does a casual compare 
        //and if it can't detect object change it will not render.
        const newFormDataKeyValue = {
            ...this.formDataKeyValue,
            [id]: newFormDataKeyValue_value
        }

        //If we don't copy the object and directly mutate it everything will seem okay but outside the component when set state is called it will not cause reRender !, it seems even hook sestate does a casual compare 
        //and if it can't detect object change it will not render.
        const newFormDataSemiKeyValue = {
            ...this.formDataSemiKeyValue,
            [id]: newFormDataSemiKeyValue_value
        }

        this.formData = newFormData
        this.formDataKeyValue = newFormDataKeyValue
        this.formDataSemiKeyValue = newFormDataSemiKeyValue

        console.log('onChange', {
            newFormData,
            newFormDataKeyValue,
            newFormDataSemiKeyValue
        })

        if (this.props.onChange && !callFormOnChangeDisabled) {
            this.props.onChange({ formData: newFormData, formDataKeyValue: newFormDataKeyValue, formDataSemiKeyValue: newFormDataSemiKeyValue })
        }
    }

    getFormData = () => {
        return {
            formData: {
                ...this.formData
            },
            formDataKeyValue: {
                ...this.formDataKeyValue,
            },
            formDataSemiKeyValue: {
                ...this.formDataSemiKeyValue
            }
        }
    }

    onGetChildRef = (id, api) => {
        this.childrenRefs[id] = api
    }

    ungroupFormData = (flatChildren, inputDefaultValue, reverseConvertToKeyValueEnabled, isInputSemiKeyValue) => {
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
    }

    reset = (inputDefaultValue, reverseConvertToKeyValueEnabled = true, isInputSemiKeyValue = false, callFormOnChangeDisabled = false) => {
        const { enums } = this.context
        const flatChildren = getFlatChildren(this.props.children)

        const ungroupedInputDefaultValue = inputDefaultValue

        console.log('enums', enums)
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
                    const foundType = this.getTypeInfo(found.type)

                    //if a reverseConvertToKeyValue exists, use it if not just put the value unchanged
                    if (!isInputSemiKeyValue && foundType.reverseConvertToKeyValue)
                        reverseConvertToKeyValueDefaultValue[key] = foundType.reverseConvertToKeyValue({ value: ungroupedInputDefaultValue[key], element: found, enums, rtl: this?.context?.rtl })
                    else if (isInputSemiKeyValue && foundType.reverseConvertToSemiKeyValue)
                        reverseConvertToKeyValueDefaultValue[key] = foundType.reverseConvertToSemiKeyValue({ value: ungroupedInputDefaultValue[key], element: found, enums, rtl: this?.context?.rtl })
                    else
                        reverseConvertToKeyValueDefaultValue[key] = ungroupedInputDefaultValue[key]
                }
                else
                    reverseConvertToKeyValueDefaultValue[key] = ungroupedInputDefaultValue[key]
            }

            newDefaultValue = reverseConvertToKeyValueDefaultValue
        }

        console.log('newDefaultValue', newDefaultValue)

        this.setState({
            defaultValue: newDefaultValue || {}
        }, () => {
            console.log('childrenRefs', this.childrenRefs)
            for (let key in this.childrenRefs) {
                if (this.childrenRefs[key] && this.childrenRefs[key].reset)
                    this.childrenRefs[key].reset({ callFormOnChangeDisabled })
            }
        })
    }

    onLockdownChange = (id, state) => {
        this.lockdown[id] = state

        let isFormOnLockdown = false

        for (let key in this.lockdown) {
            if (this.lockdown[key] === true) {
                isFormOnLockdown = true
                break
            }
        }

        if (isFormOnLockdown !== this.state.isFormOnLockdown) {
            this.setState({
                isFormOnLockdown: isFormOnLockdown,
            })
        }
    }

    compileAJV = () => {
        if (!this.props.validationDisabled) {
            const flatChildren = getFlatChildren(this.props.children)

            const properties = {}
            const requiredList = []

            flatChildren.forEach(item => {
                const props = React.isValidElement(item) ? item.props : item
                const { id, validation, type } = props
                const typeInfo = this.getTypeInfo(type)

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
                this.ajvValidate = this.ajv.compile(schema)
            else
                this.ajvValidate = null
        }
        else
            this.ajvValidate = null
    }

    normalizeErrors = (errors) => {
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
                        message: item.message ? (this?.context?.localText[item.message] || item.message) : item.message
                    }
                }
            })
        }

        console.log('errors', {
            errors,
            normalizedErrors: result,
            formData: this.formData,
            formDataKeyValue: this.formDataKeyValue,
            formDataSemiKeyValue: this.formDataSemiKeyValue,
        })

        return result
    }

    checkValidation = (onValid, onInvalid) => {
        if (this.ajvValidate) {
            //! Important !, avjVaidate which equels the result of "this.ajv.compile(schema)" will change your input! 
            //This means this.formDataSemiKeyValue will change! and gets mutated, so make sure you copy the object and don't pass a refrence!
            const isValid = this.ajvValidate({ ...this.formDataSemiKeyValue })
            console.log('this.ajvValidate', this.ajvValidate, isValid)
            const newValidationErrors = this.normalizeErrors(this.ajvValidate?.errors)

            this.setState({
                validationErrors: newValidationErrors,
            }, () => {
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
        }
        else {
            if (onValid)
                onValid()
        }
    }

    getChildProps = ({ id, enumsID, type, defaultValue, inputType, onClick, label, tabIndex, colDef, groupDataID, ...restProps }) => {
        const { childrenProps } = this.props
        const newDefaultValue = this.state.defaultValue[id] === undefined ? defaultValue : this.state.defaultValue[id]

        let newOnClick = onClick
        if (String(inputType).toLowerCase() === 'submit' && onClick) {
            newOnClick = (event, props) => {
                this.checkValidation(() => {
                    onClick(event, { ...props, formData: this.formData, formDataKeyValue: this.formDataKeyValue, formDataSemiKeyValue: this.formDataSemiKeyValue })
                })
            }
        }

        return {
            _formProps_: {
                onChildChange: ({ event, callFormOnChangeDisabled }) => this.onChildChange({ id, type, event, element: restProps, callFormOnChangeDisabled, groupDataID }),
                onLockdownChange: (state) => this.onLockdownChange(id, state),
                // ref: (node) => this.onGetChildRef(id, node),
                innerRef: (node) => this.onGetChildRef(id, node),
                isFormOnLockdown: this.state.isFormOnLockdown,
                inputType: inputType,
                errors: this.state.validationErrors,
                getTypeInfo: (type) => this.getTypeInfo(type),
                groupDataID,
            },
            id,
            type,
            defaultValue: newDefaultValue,
            label: this.context.getLocalText(id, label),
            //This is an object of props passed to form itself, the goal is to give a certain props to all the children
            ...(childrenProps || {}),
            ...restProps,
            onClick: newOnClick,
        }
    }

    render() {
        const flatChildren = getFlatChildren(this.props.children)
        const flatChildrenProps = flatChildren.map(item => {
            const { skipRender, tabIndex } = item?.props || item

            return {
                ...((!item?.props?.skipForm && this.getChildProps(item)) || {}),
                skipRender,
                tabIndex: Array.isArray(tabIndex) ? tabIndex : [tabIndex]
            }
        })

        return (
            <TabWrapper tabs={this.props.tabs} tabsGridProps={this.props.tabsGridProps} formChildrenProps={flatChildrenProps} onChange={this.props.onTabChange}>
                <ATFormRender>
                    {flatChildren}
                </ATFormRender>
            </TabWrapper>
        )
    }
}

export const formBuilder = FormBuilder;

//Make sure you don't use in constructor, context is not initialized
ATForm.contextType = ATFormContext

export default ATForm;