import { Grid } from '@mui/material'
import { useEffect, useState, useCallback, useRef } from 'react'
import AtFormDialog from '../../AtFormDialog';
import { AtFormFormDialogProps } from '../../../../types/ui/FormDialog.type'
import { useAtFormWrapper } from '../../AtFormTemplateWrappers/AtFormWrapperContext/useAtFormWrapper'
import { AtFormOnChangeInterface, AtFormRefInterface } from '../../../../types/AtForm.type'
import { AtFormOnClickType } from '../../../../types/Common.type'
import { LogLevel } from '../../AtFormLogger'


const FormDialog = ({ id, children, open: openProp, onClose, formChildren, value, onChange, ...restProps }: AtFormFormDialogProps) => {
    const wrapper = useAtFormWrapper()
    const [internalOpen, setInternalOpen] = useState(false)
    const mFormRef = useRef<AtFormRefInterface>(null)

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

    const onSubmitClick: AtFormOnClickType<AtFormOnChangeInterface> = (props) => {
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
                <AtFormDialog
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
                            ...(formChildren || [])
                        ]
                    }
                </AtFormDialog>
            }
        </Grid>
    )
}

export default FormDialog
