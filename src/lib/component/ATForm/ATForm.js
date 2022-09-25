import { Grid } from '@mui/material';
import React, { PureComponent } from 'react';

//Components
import UIBuilder from './UIBuilder/UIBuilder';
// //Utils
import * as FormUtils from './FormUtils/FormUtils';
import * as FormBuilder from './FormBuilder/FormBuilder';
import { types } from './UITypeUtils/UITypeUtils';
//Validation
import Ajv from "ajv"
//DatePicker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

class ATForm extends PureComponent {
    constructor(props) {
        super(props)

        this.childrenRefs = {}
        this.formData = {}
        this.formDataKeyValue = {}
        this.lockdown = {}
        this.ajv = new Ajv({ allErrors: true, coerceTypes: true })
        this.ajvValidate = null
        this.compileAJV()
    }

    state = {
        defaultValue: {},
        isFormOnLockdown: false,
        validationErrors: null,
    }

    onChildChange = ({ id, type, event }) => {
        const found = types.find(item => item.type === type)

        this.formData = {
            ...this.formData,
            [id]: {
                value: event.target.value,
                type: type,
            }
        }

        this.formDataKeyValue = {
            ...this.formDataKeyValue,
            [id]: found.convertToKeyValue ? found.convertToKeyValue(event) : event.target.value
        }

        if (this.props.onChange) {
            this.props.onChange({ formData: this.formData, formDataKeyValue: this.formDataKeyValue })
        }
    }

    onGetChildRef = (id, api) => {
        this.childrenRefs[id] = api
    }

    reset = (newDefaultValue) => {
        this.setState({
            defaultValue: newDefaultValue || {}
        }, () => {
            for (let key in this.childrenRefs) {
                if (this.childrenRefs[key].reset)
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
        const flatChildren = this.getFlatChildren()

        const properties = {}
        const requiredList = []

        flatChildren.forEach(item => {
            const props = React.isValidElement(item) ? item.props : item
            const { id, validation } = props

            if (validation) {
                const { required, ...restValidation } = validation
                if (required)
                    requiredList.push(id)
                properties[id] = restValidation
            }
        })

        const schema = {
            type: 'object',
            properties: properties,
            required: requiredList,
            // additionalProperties: false,
        }


        if (requiredList.length || Object.keys(properties).length)
            this.ajvValidate = this.ajv.compile(schema)
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

        return result
    }

    getChildProps = ({ id, type, defaultValue, inputType, onClick, ...restProps }) => {
        const { childrenProps } = this.props
        const formDefaultValue = this.props.defaultValue ? this.props.defaultValue : this.state.defaultValue
        const newDefaultValue = formDefaultValue[id] === undefined ? defaultValue : formDefaultValue[id]
        let newOnClick = onClick
        if (String(inputType).toLowerCase() === 'submit' && onClick && this.ajvValidate) {
            newOnClick = (event, props) => {
                const isValid = this.ajvValidate(this.formDataKeyValue)
                const newValidationErrors = this.normalizeErrors(this.ajvValidate?.errors)

                this.setState({
                    validationErrors: newValidationErrors,
                }, () => {
                    if (isValid) {
                        onClick(event, { ...props, formData: this.formData })
                    }
                    else {
                        //Show a notification      
                    }
                })
            }
        }

        return {
            _formProps_: {
                onChildChange: ({ event }) => this.onChildChange({ id, type, event }),
                onLockdownChange: (state) => this.onLockdownChange(id, state),
                // ref: (node) => this.onGetChildRef(id, node),
                innerRef: (node) => this.onGetChildRef(id, node),
                isFormOnLockdown: this.state.isFormOnLockdown,
                inputType: inputType,
                errors: this.state.validationErrors,
                serviceManager: this.props.serviceManager
            },
            id,
            type,
            defaultValue: newDefaultValue,
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

            return <Grid key={props.id} item {...FormUtils.getFlexGrid(props)}> {!skipRender && this.getRenderableItem(item)} </Grid>
        })

        return (
            <React.Fragment>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    {validChildren}
                </LocalizationProvider>
            </React.Fragment>
        )
    }
}

export const formBuilder = FormBuilder;

export default ATForm;