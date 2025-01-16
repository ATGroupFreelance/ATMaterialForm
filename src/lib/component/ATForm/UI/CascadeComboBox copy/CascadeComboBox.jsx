import React, { useState, useEffect } from 'react';

import BaseComboBox from './BaseComboBox/BaseComboBox';

const CascadeComboBox = ({ atFormProvidedProps, label, design, onChange, value, autoComplete = 'disabled', error, helperText, ...restProps }) => {
    const [localValue, setLocalValue] = useState(null)

    useEffect(() => {
        console.log('value', value)
        setLocalValue((prevLocalValue) => {
            let newLocalValue = [
                ...(prevLocalValue || [])
            ]

            if (newLocalValue.length !== design.length) {
                design.forEach(item => newLocalValue.push(null))
            }

            for (let i = design.length - 1; i >= 0; i--) {
                if (i === design.length - 1) {
                    if (value) {
                        const found = design[i].data.find(item => item.id === value.id)
                        newLocalValue[i] = found
                    }
                    else
                        newLocalValue[i] = value
                }
                else if (value !== null) {
                    const id = newLocalValue[i + 1][design[i].id]

                    newLocalValue[i] = design[i].data.find(item => item.id === id)
                }
            }

            return newLocalValue
        })
    }, [value, design])

    const onInternalChange = (event, { id, index }) => {
        setLocalValue((prevLocalValue) => {
            const newLocalValue = [
                ...prevLocalValue
            ]

            for (let i = 0; i < newLocalValue.length; i++) {
                if (i === index) {
                    if (event.target.value) {
                        const found = design[i].data.find(item => event.target.value.id === item.id)
                        newLocalValue[i] = {
                            ...found
                        }
                    }
                    else
                        newLocalValue[i] = event.target.value
                }

                else if (i > index)
                    newLocalValue[i] = null
            }

            //If its the Leafe update the value
            if (index === design.length - 1)
                onChange(event)
            else
                onChange({ target: { value: null } })

            return newLocalValue
        })
    }

    console.log('newLocalValue', localValue)

    return <React.Fragment>
        {localValue && design.map((item, index) => {
            return <BaseComboBox
                key={item.id}
                {...item}
                data={item.data.filter(item => index === 0 || !localValue[index - 1] || (item[design[index - 1].id] === localValue[index - 1].id))}
                onChange={(event) => onInternalChange(event, { id: item.id, index })}
                value={localValue[index]}
                disabled={index !== 0 && localValue[index - 1] === null}
                error={error}
                helperText={helperText}
            />
        })}
    </React.Fragment>
}

export default CascadeComboBox;