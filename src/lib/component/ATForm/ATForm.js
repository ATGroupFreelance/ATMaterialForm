import { Grid } from '@mui/material';
import React, { PureComponent } from 'react';

//Components
import UIBuilder from './UIBuilder/UIBuilder';
// //Utils
import * as FormUtils from './FormUtils/FormUtils';
import * as FormBuilder from './FormBuilder/FormBuilder';
import { getTypeInfo } from './UITypeUtils/UITypeUtils';
//Validation
import Ajv from "ajv"
import AVJErrors from 'ajv-errors';
//Context
import ATFormContext from './ATFormContext/ATFormContext';

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

                console.log('eachPropIsValid', result, data)

                return result
            }
        });

        this.ajvValidate = null
        this.compileAJV()
    }

    componentDidMount() {
        if (this.props.defaultValue)
            this.reset(this.props.defaultValue)
    }

    state = {
        defaultValue: {},
        isFormOnLockdown: false,
        validationErrors: null,
    }

    onChildChange = ({ id, type, event, element }) => {
        const { enums } = this.context
        const found = getTypeInfo(type) || (this.context.customComponents && this.context.customComponents.find(item => item.typeInfo.type === type))

        //If we don't copy the object and directly mutate it everything will seem okay but outside the component when set state is called it will not cause reRender !, it seems even hook sestate does a casual compare 
        //and if it can't detect object change it will not render.
        const newFormData = {
            ...this.formData,
            [id]: {
                value: event.target.value,
                type: type,
            }
        }

        //If we don't copy the object and directly mutate it everything will seem okay but outside the component when set state is called it will not cause reRender !, it seems even hook sestate does a casual compare 
        //and if it can't detect object change it will not render.
        const newFormDataKeyValue = {
            ...this.formDataKeyValue,
            [id]: found.convertToKeyValue ? found.convertToKeyValue(event, element, enums) : event.target.value
        }

        const newFormDataSemiKeyValue = {
            ...this.formDataSemiKeyValue,
            [id]: found.convertToSemiKeyValue ? found.convertToSemiKeyValue(event, element, enums) : event.target.value
        }

        this.formData = newFormData
        this.formDataKeyValue = newFormDataKeyValue
        this.formDataSemiKeyValue = newFormDataSemiKeyValue

        console.log('onChange', {
            newFormData,
            newFormDataKeyValue,
            newFormDataSemiKeyValue
        })

        if (this.props.onChange) {
            this.props.onChange({ formData: newFormData, formDataKeyValue: newFormDataKeyValue, formDataSemiKeyValue: newFormDataSemiKeyValue })
        }
    }

    onGetChildRef = (id, api) => {
        this.childrenRefs[id] = api
    }

    reset = (inputDefaultValue, reverseConvertToKeyValueEnabled = true, isInputSemiKeyValue = false) => {
        const { enums } = this.context
        console.log('enums', enums)
        //If default value is not key value just use it!
        let newDefaultValue = inputDefaultValue

        //If default value is a key value, process it so it becomes a formData format
        if (reverseConvertToKeyValueEnabled && inputDefaultValue) {
            const reverseConvertToKeyValueDefaultValue = {}
            const flatChildren = this.getFlatChildren()

            for (let key in inputDefaultValue) {
                //Find the elemenet of the value using id match
                const found = flatChildren.find((item) => String(item.id) === String(key))
                if (found) {
                    //Find the element's type inside types which is inisde UITypeUtils, using this type we can do a reverseConvertToKeyValue
                    const foundType = getTypeInfo(found.type) || (this.context.customComponents && this.context.customComponents.find(item => item.typeInfo.type === found.type))

                    //if a reverseConvertToKeyValue exists, use it if not just put the value unchanged
                    if (!isInputSemiKeyValue && foundType.reverseConvertToKeyValue)
                        reverseConvertToKeyValueDefaultValue[key] = foundType.reverseConvertToKeyValue({ value: inputDefaultValue[key], element: found, enums })
                    else if (isInputSemiKeyValue && foundType.reverseConvertToSemiKeyValue)
                        reverseConvertToKeyValueDefaultValue[key] = foundType.reverseConvertToSemiKeyValue({ value: inputDefaultValue[key], element: found, enums })
                    else
                        reverseConvertToKeyValueDefaultValue[key] = inputDefaultValue[key]
                }
                else
                    reverseConvertToKeyValueDefaultValue[key] = inputDefaultValue[key]
            }

            newDefaultValue = reverseConvertToKeyValueDefaultValue
        }

        console.log('newDefaultValue', newDefaultValue)

        this.setState({
            defaultValue: newDefaultValue || {}
        }, () => {
            for (let key in this.childrenRefs) {
                if (this.childrenRefs[key] && this.childrenRefs[key].reset)
                    this.childrenRefs[key].reset()
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

    getRenderableItem = (item) => {
        return React.isValidElement(item) ?
            item.props.formskip ?
                //Example: <div formskip={true}><TextBox/></div>
                item
                :
                //Example: <TextBox/>
                React.cloneElement(item, { ...this.getChildProps({ ...item.props, type: item.type.name || item.type }), key: item.props.id })
            :
            //Example: {
            //     type: 'TextBox'
            // }
            <UIBuilder key={item.id} {...this.getChildProps(item)} />
    }

    compileAJV = () => {
        if (!this.props.validationDisabled) {
            const flatChildren = this.getFlatChildren()

            const properties = {}
            const requiredList = []

            flatChildren.forEach(item => {
                const props = React.isValidElement(item) ? item.props : item
                const { id, validation, type } = props
                const typeInfo = getTypeInfo(type)

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
                        properties[id] = restValidation
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

    getFlatChildren = () => {
        let arrayChildren = []
        if (this.props.children) {
            if (Array.isArray(this.props.children))
                arrayChildren = this.props.children
            else
                arrayChildren.push(this.props.children)
        }

        return arrayChildren.flat(1)
    }

    normalizeErrors = (errors) => {
        const result = {}

        const getID = (item) => {
            const { instancePath } = item
            const regexResult = instancePath.match(/\/(\w*)/)

            console.log('regexResult', item, regexResult)

            return regexResult.length > 1 ? regexResult[1] : null
        }

        if (errors) {
            errors.forEach(item => {
                const id = getID(item)
                if (id) {
                    result[getID(item)] = {
                        error: true,
                        ...item,
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

    checkValidation = (onValid) => {
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
                    //Show a notification      
                }
            })
        }
        else {
            if (onValid)
                onValid()
        }
    }

    getChildProps = ({ id, type, defaultValue, inputType, onClick, label, flexGridProps, ...restProps }) => {
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
                onChildChange: ({ event }) => this.onChildChange({ id, type, event, element: restProps }),
                onLockdownChange: (state) => this.onLockdownChange(id, state),
                // ref: (node) => this.onGetChildRef(id, node),
                innerRef: (node) => this.onGetChildRef(id, node),
                isFormOnLockdown: this.state.isFormOnLockdown,
                inputType: inputType,
                errors: this.state.validationErrors,
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
        const validChildren = this.getFlatChildren().map(item => {
            const props = React.isValidElement(item) ? item.props : item
            const { skipRender } = props

            return <Grid key={props.id} item {...FormUtils.getFlexGrid(props)} > {!skipRender && this.getRenderableItem(item)} </Grid>
        })

        return (
            <React.Fragment>
                {validChildren}
            </React.Fragment>
        )
    }
}

export const formBuilder = FormBuilder;

ATForm.contextType = ATFormContext
export default ATForm;