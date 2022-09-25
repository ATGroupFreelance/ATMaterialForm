import React, { useEffect, useState } from 'react';

import ComboBox from '../../ComboBox/ComboBox';
import { Grid } from "@mui/material";

const BaseComboBox = ({ id, value, parentID, data, multiple, xs, md, lg, xl, ...restProps }) => {
    const [options, setOptions] = useState(null)

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
        if (parentID && value && value[parentID]) {
            const keyValue = {}
            for (let key in value) {
                if (Array.isArray(value[key]))
                    keyValue[key] = value[key].map(item => item.ID)
                else
                    keyValue[key] = value[key] ? value[key].ID : null
            }

            data(keyValue)
                .then(res => {
                    setOptions(res)
                })
                .catch(error => {
                    setOptions([])
                })
        }
        // eslint-disable-next-line
    }, [value])

    const disabled = parentID ? (value ? !value[parentID] : true) : false
    let newValue = value ? value[id] : undefined
    if (!newValue)
        newValue = multiple ? [] : null

    return <Grid item xs={12} md={md || 3} lg={lg} xl={xl}>
        {
            <ComboBox options={options} value={newValue} disabled={disabled || !options} multiple={multiple} {...restProps} />
        }
    </Grid>
}

export default BaseComboBox;