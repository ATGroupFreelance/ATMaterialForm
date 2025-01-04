import React from 'react';

import BaseComboBox from './BaseComboBox/BaseComboBox';

const MultiValueCascadeComboBox = ({ atFormProvidedProps, label, design, onChange, value, autoComplete = 'disabled', error, helperText, ...restProps }) => {
    const onInternalChange = (id, event, children) => {
        const newValue = {
            ...(value || {}),
            [id]: event.target.value,
        }

        const resetChildrenValue = (childList) => {
            for (let i = 0; i < childList.length; i++) {
                if (Object.prototype.hasOwnProperty.call(newValue,(childList[i].id))) {
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

        designLayer.forEach(({ id, children, enumKey, enumParentKey,...restItem }) => {
            result.push({
                id: id,
                ...restItem,
                value: value,
                parentID: parentID,
                onChange: (event) => onInternalChange(id, event, children)
            })

            if (children) {
                const childrenResult = getRenderableComboBoxFlatList(children, id)
                childrenResult.forEach(cItem => result.push(cItem))
            }
        })

        return result
    }

    const elementList = getRenderableComboBoxFlatList(design)

    return <React.Fragment>
        {
            elementList.map(item => {
                return <BaseComboBox key={item.id} label={item.label || item.id} error={error} helperText={helperText} {...item} />
            })
        }
    </React.Fragment>
}

export default MultiValueCascadeComboBox;