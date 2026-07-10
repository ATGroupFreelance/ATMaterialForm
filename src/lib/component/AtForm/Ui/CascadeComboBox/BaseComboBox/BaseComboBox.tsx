import { useEffect, useState } from 'react';

import ComboBox from '../../ComboBox/ComboBox';
import { Grid } from "@mui/material";
import useAtFormConfig from '../../../../../hooks/useAtFormConfig/useAtFormConfig';
import { AtFormCascadeComboBoxBaseComboBoxProps } from '../../../../../types/ui/CascadeComboBox.type';
import { AtFormComboBoxStaticOptions } from '../../../../../types/ui/ComboBox.type';
import { AtEnumItemType } from '../../../../../types/Common.type';

const BaseComboBox = ({ id, value, parentId, options, multiple, readOnly, size = { xs: 12, md: 3, lg: 3, xl: 3 }, uiProps }: AtFormCascadeComboBoxBaseComboBoxProps) => {
    const [localValue, setLocalValue] = useState(value)
    const [localOptions, setlocalOptions] = useState<AtFormComboBoxStaticOptions>(null)
    const [parentPrevValue, setParentPrevValue] = useState(null)
    const [forceDisabled, setForceDisabled] = useState(false)
    const { enums } = useAtFormConfig()

    console.log('BaseComboBox', {
        id,
        value,
        parentId,
        localOptions,
        localValue,
    })

    //Handle root elements
    useEffect(() => {
        /**If its not a child and its a parent it must use its full options and doesn't need to filter it */
        if (!parentId) {
            options({ enums, values: null })
                .then((res: AtFormComboBoxStaticOptions) => {
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
        if (parentId && value && value[parentId] && (parentPrevValue !== value[parentId])) {
            const values: Record<string, string | Array<AtEnumItemType>> = {}

            for (const key in value) {
                if (Array.isArray(value[key]))
                    values[key] = value[key].map(item => item.id)
                else
                    values[key] = value[key] ? value[key].id : null
            }

            setParentPrevValue(value[parentId])
            setForceDisabled(true)

            options({ enums, values })
                .then(res => {
                    console.log('options result', res)
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

    const disabled = parentId ? (localValue ? !localValue[parentId] : true) : false
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