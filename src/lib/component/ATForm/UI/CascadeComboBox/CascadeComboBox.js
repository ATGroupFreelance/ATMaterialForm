import React from 'react';

import BaseComboBox from './BaseComboBox/BaseComboBox';

const CascadeComboBox = ({ _formProps_, label, design, onChange, value, autoComplete = 'disabled', error, helperText, ...restProps }) => {
    const onInternalChange = (id, event) => {
        const newValue = {
            ...(value || {}),
            [id]: event.target.value,
        }

        onChange({ target: { value: newValue } })
    }

    const getRenderableComboBoxFlatList = (designLayer, parentID = null) => {
        const result = []

        designLayer.forEach(({ id, children, ...restItem }) => {
            result.push({
                id: id,
                ...restItem,
                value: value,
                parentID: parentID,
                onChange: (event) => onInternalChange(id, event)
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
                return <BaseComboBox key={item.id} label={item.label || item.id}  {...item} />
            })
        }
    </React.Fragment>
}

export default CascadeComboBox;