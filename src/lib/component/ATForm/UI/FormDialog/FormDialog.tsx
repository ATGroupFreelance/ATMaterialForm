import { Grid } from '@mui/material'
import { useEffect, useState, useCallback, useRef } from 'react'
import { ATFormDialog } from '@/lib'
import { ATFormFormDialogProps } from '@/lib/types/ui/FormDialog.type'
import { useATFormWrapper } from '../../ATFormTemplateWrappers/ATFormWrapperContext/useATFormWrapper'
import { ATFormOnChangeInterface, ATFormRefInterface } from '@/lib/types/ATForm.type'
import { ATFormOnClickType } from '@/lib/types/Common.type'
import { LogLevel } from '../../ATFormLogger'


const FormDialog = ({ id, children, open: openProp, onClose, elements, value, onChange, ...restProps }: ATFormFormDialogProps) => {
    const wrapper = useATFormWrapper()
    const [internalOpen, setInternalOpen] = useState(false)
    const mFormRef = useRef<ATFormRefInterface>(null)

    void id;
    const isControlled = openProp !== undefined
    const open = isControlled ? openProp : internalOpen

    useEffect(() => {
        if (!wrapper?.register || isControlled)
            return

        return wrapper?.register(() => setInternalOpen(true))
    }, [wrapper, isControlled])

    const handleClose = useCallback(() => {
        if (!isControlled) setInternalOpen(false)
        onClose?.()
    }, [isControlled, onClose])

    const onSubmitClick: ATFormOnClickType<ATFormOnChangeInterface> = (props) => {
        if (onChange) {
            onChange({ target: { value: props.formDataSemiKeyValue } })
        }
        handleClose()
    }

    const handleReset = () => {
        mFormRef.current?.reset()
    }

    return (
        <Grid container spacing={2}>
            {
                open &&
                <ATFormDialog
                    ref={mFormRef}
                    onClose={handleClose}
                    defaultValue={value}
                    valueFormat='FormDataSemiKeyValue'
                    onSubmitClick={onSubmitClick}
                    getActions={(defaultActions: any) => [
                        ...defaultActions,
                        { id: 'Reset', label: 'Reset', onClick: handleReset, color: 'warning' }
                    ]}
                    logLevel={LogLevel.NONE}
                    {...restProps}
                >
                    {
                        [
                            ...(children as Array<any> || []),
                            ...(elements || [])
                        ]
                    }
                </ATFormDialog>
            }
        </Grid>
    )
}

export default FormDialog
