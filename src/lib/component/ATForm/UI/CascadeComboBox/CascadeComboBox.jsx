import React from 'react';

import BaseComboBox from './BaseComboBox/BaseComboBox';
/**
    Cascade Overview:

    Result of Cascade on Change:
    When the cascade changes, it produces an object containing all child values. However, the form's convertToKeyValue logic returns only a single leaf value.

    How Does Cascade Work?
    The Cascade component operates on a tree structure provided through the design prop. This tree defines the cascade's behavior and supports the following main properties:

    id: The name/key where each combo box's value is stored.

    enumKey: Specifies which enum is used to map a single leaf value back into the full object containing all combo box values.

    enumParentKey: Indicates the key in the current enum that identifies the parent ID of the current value.
    For example, if the current layer has id and title, it will also have another property named by enumParentKey, which helps locate the parent ID.

    data: A function that returns a promise, providing the data for the current combo box.
    You can filter this data based on enumParentKey and the current enum?.enumKey.
    If no data is provided, it will be auto-generated using enumKey and enumParentKey.

    Default Behavior:

    If enumKey and enumParentKey are not provided, the createCascadeDesign function will:
    Use id to deduce the enumKey.
    Determine the enumParentKey based on the parent-child relationship.
    Automatically generate the data.
    
    Example and Playground:
    You can provide a custom cascade tree through the design prop to define its structure. For more examples and possible combinations, refer to the CascadeComboBoxPlayground.
 */
const CascadeComboBox = ({ atFormProvidedProps, label, design, onChange, value, autoComplete = 'disabled', error, helperText, readOnly }) => {
    void atFormProvidedProps;

    const onInternalChange = (id, event, children) => {
        const newValue = {
            ...(value || {}),
            [id]: event.target.value,
        }

        const resetChildrenValue = (childList) => {
            for (let i = 0; i < childList.length; i++) {
                if (Object.prototype.hasOwnProperty.call(newValue, childList[i].id)) {
                    newValue[childList[i].id] = null

                    if (childList[i].children) {
                        resetChildrenValue(childList[i].children)
                    }
                }
            }
        }

        if (children)
            resetChildrenValue(children)

        onChange({ target: { value: newValue } })
    }

    const getRenderableComboBoxFlatList = (designLayer, parentID = null) => {
        const result = []
        /**enumKey and enumParentKey are used for reverse convert from a single leaf to a whole object of values */
        designLayer?.forEach(({ id, children, data, multiple, readOnly, enumKey, enumParentKey, ...remainingComboBoxProps }) => {
            const newData = data ?
                data
                :
                (props) => new Promise((resolve) => {
                    const options = props?.enums?.[enumKey].filter((item) => {
                        if (enumParentKey === "ParentID")
                            return item?.[enumParentKey] === props?.keyValue?.[parentID]
                        else
                            return !item.ParentID && item?.[enumParentKey] === props?.keyValue?.[enumParentKey]
                    })

                    resolve(options)
                })

            result.push({
                id,
                value,
                parentID,
                data: newData,
                multiple,
                readOnly,
                onChange: (event) => onInternalChange(id, event, children),
                ...remainingComboBoxProps,
            })

            if (children) {
                const childrenResult = getRenderableComboBoxFlatList(children, id)
                childrenResult.forEach(cItem => result.push(cItem))
            }
        })

        return result
    }

    const elementList = getRenderableComboBoxFlatList(design, null)

    return <React.Fragment>
        {
            elementList.map(item => {
                return <BaseComboBox key={item.id} label={item.label || item.id} error={error} helperText={helperText} {...item} readOnly={readOnly} />
            })
        }
        {
            !design && <BaseComboBox label={label + ' (Provide a design!)'} />
        }
    </React.Fragment>
}

export default CascadeComboBox;