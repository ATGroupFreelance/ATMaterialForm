import React, { useEffect, useState } from 'react';

import ComboBox from '../../ComboBox/ComboBox';
import { Grid2 } from "@mui/material";

const BaseComboBox = ({ id, value, parentID, data, multiple, readOnly, size = { xs: 12, md: 3, lg: 3, xl: 3 }, ...restProps }) => {
    const [localValue, setLocalValue] = useState(value)
    const [options, setOptions] = useState(null)
    const [parentPrevValue, setParentPrevValue] = useState(null)
    const [forceDisabled, setForceDisabled] = useState(false)

    //Handle root elements
    useEffect(() => {
        if (parentID === null) {
            data()
                .then(res => {
                    setOptions(res)
                })
                .catch(error => {
                    setOptions([])
                })
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        //Why ? because if options is set before the value is set it can cause a warning that "value can't be found" which is why we make sure the options is set first.
        setLocalValue(value)

        // eslint-disable-next-line
    }, [options])

    useEffect(() => {
        if (parentID && value && value[parentID] && (parentPrevValue !== value[parentID])) {
            const keyValue = {}
            for (let key in value) {
                if (Array.isArray(value[key]))
                    keyValue[key] = value[key].map(item => item.ID)
                else
                    keyValue[key] = value[key] ? value[key].ID : null
            }

            setParentPrevValue(value[parentID])
            setForceDisabled(true)

            data(keyValue)
                .then(res => {
                    setOptions(res)
                })
                .catch(error => {
                    setOptions([])
                })
                .finally(() => {
                    setForceDisabled(false)
                })
        }
        else
            setLocalValue(value)

        // eslint-disable-next-line
    }, [value])

    const disabled = parentID ? (localValue ? !localValue[parentID] : true) : false
    let newValue = localValue ? localValue[id] : undefined
    if (!newValue)
        newValue = multiple ? [] : null

    return <Grid2 size={size}>
        {
            <ComboBox options={options} value={newValue} disabled={disabled || !options || forceDisabled} multiple={multiple} readOnly={readOnly} {...restProps} />
        }
    </Grid2>
}

export default BaseComboBox;