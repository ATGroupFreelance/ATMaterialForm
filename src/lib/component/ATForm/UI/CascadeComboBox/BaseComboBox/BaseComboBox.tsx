import React, { useEffect, useState } from 'react';

import ComboBox from '../../ComboBox/ComboBox';
import { Grid } from "@mui/material";
import useATFormConfig from '@/lib/hooks/useATFormConfig/useATFormConfig';
import { ATFormCascadeComboBoxBaseComboBoxProps } from '@/lib/types/ui/CascadeComboBox.type';
import { ATFormComboBoxOptionsType } from '@/lib/types/ui/ComboBox.type';
import { ATEnumItemType } from '@/lib/types/Common.type';

const BaseComboBox = ({ id, value, parentID, options, multiple, readOnly, size = { xs: 12, md: 3, lg: 3, xl: 3 }, uiProps }: ATFormCascadeComboBoxBaseComboBoxProps) => {
    const [localValue, setLocalValue] = useState(value)
    const [localOptions, setlocalOptions] = useState<ATFormComboBoxOptionsType>(null)
    const [parentPrevValue, setParentPrevValue] = useState(null)
    const [forceDisabled, setForceDisabled] = useState(false)
    const { enums } = useATFormConfig()

    //Handle root elements
    useEffect(() => {
        /**If its not a child and its a parent it must use its full options and doesn't need to filter it */
        if (parentID === null) {
            if (typeof options === 'function')
                options({ enums, values: null })
                    .then((res: ATFormComboBoxOptionsType) => {
                        setlocalOptions(res)
                    })
                    .catch(() => {
                        setlocalOptions([])
                    })
        }
        // eslint-disable-next-line
    }, [enums])

    useEffect(() => {
        //Why ? because if localOptions is set before the value is set it can cause a warning that "value can't be found" which is why we make sure the localOptions is set first.
        setLocalValue(value)

        // eslint-disable-next-line
    }, [localOptions])

    useEffect(() => {
        /**If its a child its data must be filtered based on its parent's value */
        if (parentID && value && value[parentID] && (parentPrevValue !== value[parentID])) {
            const values: Record<string, string | Array<ATEnumItemType>> = {}

            for (let key in value) {
                if (Array.isArray(value[key]))
                    values[key] = value[key].map(item => item.id)
                else
                    values[key] = value[key] ? value[key].id : null
            }

            setParentPrevValue(value[parentID])
            setForceDisabled(true)

            if (typeof options === 'function')
                options({ enums, values })
                    .then(res => {
                        setlocalOptions(res)
                    })
                    .catch(() => {
                        setlocalOptions([])
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
            <ComboBox options={localOptions} value={newValue} disabled={disabled || !localOptions || forceDisabled} multiple={multiple} readOnly={readOnly} {...uiProps} />
        }
    </Grid>
}

export default BaseComboBox;