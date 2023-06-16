import { Grid } from '@mui/material';
import React, { PureComponent } from 'react';

// //Utils
import * as FormUtils from './FormUtils/FormUtils';
import * as FormBuilder from './FormBuilder/FormBuilder';
import { getTypeInfo } from './UITypeUtils/UITypeUtils';
//Validation
import Ajv from "ajv"
import AVJErrors from 'ajv-errors';
//Context
import ATFormContext from './ATFormContext/ATFormContext';
//Components
import UIBuilder from './UIBuilder/UIBuilder';
import TabView from './TabView/TabView';

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
        this.compileAJV()
    }

    componentDidMount() {
        if (this.props.defaultValue)
            this.reset(this.props.defaultValue, true, this.props.isDefaultValueSemiKeyValue)
    }

    componentDidUpdate(prevProps) {
        const oldFlatChildren = this.getFlatChildren(prevProps.children)
        const newFlatChildren = this.getFlatChildren(this.props.children)

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
        currentTabIndex: 0,
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
            const flatChildren = this.getFlatChildren(this.props.children)

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
            const flatChildren = this.getFlatChildren(this.props.children)

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

    getFlatChildren = (children) => {
        let arrayChildren = []
        if (children) {
            if (Array.isArray(children))
                arrayChildren = children
            else
                arrayChildren.push(children)
        }

        return arrayChildren.flat(1)
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

    getChildProps = ({ id, enumsID, type, defaultValue, inputType, onClick, label, flexGridProps, tabIndex, ...restProps }) => {
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
        const validChildren = this.getFlatChildren(this.props.children).map(item => {
            const props = React.isValidElement(item) ? item.props : item
            const { skipRender, tabIndex } = props

            return < Grid key={props.id} item sx={{ ...(!this.props.tabs || (this.state.currentTabIndex === tabIndex) ? {} : { display: 'none' }) }} {...FormUtils.getFlexGrid(props)}  > {!skipRender && this.getRenderableItem(item)} </Grid >
        })

        return (
            <React.Fragment>
                {this.props.tabs && <Grid item md={12}><TabView tabs={this.props.tabs} activeTabIndex={this.state.currentTabIndex} onTabChange={(event, newIndex) => this.setState({ currentTabIndex: newIndex })} /></Grid>}
                {validChildren}
            </React.Fragment>
        )
    }
}

export const formBuilder = FormBuilder;

ATForm.contextType = ATFormContext
export default ATForm;