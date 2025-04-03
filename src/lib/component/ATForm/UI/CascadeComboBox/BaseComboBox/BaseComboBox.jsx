import React, { useEffect, useState } from 'react';

import ComboBox from '../../ComboBox/ComboBox';
import { Grid } from "@mui/material";
import useATFormProvider from '@/lib/hooks/useATFormProvider/useATFormProvider';

const BaseComboBox = ({ id, value, parentID, data, multiple, readOnly, size = { xs: 12, md: 3, lg: 3, xl: 3 }, ...restProps }) => {
    const [localValue, setLocalValue] = useState(value)
    const [options, setOptions] = useState(null)
    const [parentPrevValue, setParentPrevValue] = useState(null)
    const [forceDisabled, setForceDisabled] = useState(false)
    const { enums } = useATFormProvider()

    //Handle root elements
    useEffect(() => {
        /**If its not a child and its a parent it must use its full data and doesn't need to filter it */
        if (parentID === null) {
            data({ enums, keyValue: null, value: null, test: 'A' })
                .then(res => {
                    setOptions(res)
                })
                .catch(error => {
                    setOptions([])
                })
        }
        // eslint-disable-next-line
    }, [enums])

    useEffect(() => {
        //Why ? because if options is set before the value is set it can cause a warning that "value can't be found" which is why we make sure the options is set first.
        setLocalValue(value)

        // eslint-disable-next-line
    }, [options])

    useEffect(() => {
        /**If its a child its data must be filtered based on its parent's value */
        if (parentID && value && value[parentID] && (parentPrevValue !== value[parentID])) {
            const keyValue = {}
            for (let key in value) {
                if (Array.isArray(value[key]))
                    keyValue[key] = value[key].map(item => item.id)
                else    
                    keyValue[key] = value[key] ? value[key].id : null
            }

            setParentPrevValue(value[parentID])
            setForceDisabled(true)

            data({ enums, keyValue, value, test: 'B' })
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
    }, [value, enums])

    const disabled = parentID ? (localValue ? !localValue[parentID] : true) : false
    let newValue = localValue ? localValue[id] : undefined
    if (!newValue)
        newValue = multiple ? [] : null

    return <Grid size={size}>
        {
            <ComboBox options={options} value={newValue} disabled={disabled || !options || forceDisabled} multiple={multiple} readOnly={readOnly} {...restProps} />
        }
    </Grid>
}

export default BaseComboBox;