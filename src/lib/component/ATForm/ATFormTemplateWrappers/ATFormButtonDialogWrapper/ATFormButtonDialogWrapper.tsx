import { Grid } from '@mui/material'
import { ATFormButtonDialogWrapperProps } from '@/lib/types/template-wrappers/ButtonDialogWrapper.type'
import React, { ReactElement, useImperativeHandle, useRef, useState } from 'react'
import ATFormButtonDialogWrapperDialog from './ATFormButtonDialogWrapperDialog/ATFormButtonDialogWrapperDialog'
import { ATFormChildResetInterface, ATFormOnChildChangeInterface } from '@/lib/types/ATForm.type'
import useATForm from '@/lib/hooks/useATForm/useATForm'
import { getInitialValue } from '../../UIBuilder/ControlledUIBuilder/ControlledUIBuilder'
import ATFormButtonDialogStyledButton from './ATFormButtonDialogStyledButton/ATFormButtonDialogStyledButton'

const ATFormButtonDialogWrapper = ({ children, childProps, config }: ATFormButtonDialogWrapperProps) => {
    const [dialog, setDialog] = useState<any>(null)
    const mLastSavedValue = useRef(childProps.isFormControlled ? childProps.value : childProps.tProps.defaultValue)
    const { getFormData } = useATForm()
    const mChangeID = useRef<number>(0)

    const mChildRef = useRef<{ reset: (props?: ATFormChildResetInterface) => void }>(null)

    const { size = 12, label = "Open" } = childProps.tProps

    const internalReset = ({ suppressFormOnChange = false }: ATFormChildResetInterface = {} as ATFormChildResetInterface) => {
        const newValue = getInitialValue(childProps.typeInfo!, childProps.tProps?.defaultValue)

        if (childProps.isFormControlled)
            mChangeID.current = mChangeID.current + 1

        childProps.onChildChange({ event: { target: { value: newValue } }, suppressFormOnChange, childProps, changeID: mChangeID.current })
    }

    //Overwrite form child reset with our own reset.
    useImperativeHandle(childProps.tProps.ref, () => {
        return {
            reset: internalReset,
        }
    })

    const onChange = ({ event }: ATFormOnChildChangeInterface) => {
        mLastSavedValue.current = event.target.value
    }

    const onInternalClick = () => {
        const lastValue = getFormData().formDataSemiKeyValue?.[childProps.tProps.id]
        const child: ReactElement = children

        //We remove ref from tProps because we don't want to pass the ref down to the child component        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ref: _unusedRef, ...refFreeTProps } = childProps.tProps

        const props = {
            childProps: {
                ...childProps,
                isFormControlled: false,
                tProps: {
                    ...refFreeTProps,
                    ref: mChildRef,
                    defaultValue: lastValue,
                },
                onChildChange: onChange
            }
        }

        setDialog(
            <ATFormButtonDialogWrapperDialog
                onClose={onHandleDialogClose}
                onSubmitClick={() => {
                    //Apply the change.
                    if (childProps.onChildChange) {
                        if (childProps.isFormControlled)
                            mChangeID.current = mChangeID.current + 1

                        childProps.onChildChange({ event: { target: { value: mLastSavedValue.current } }, childProps, changeID: mChangeID.current })

                        onHandleDialogClose()
                    }
                }}
                onResetClick={() => {
                    mChildRef.current?.reset()
                }}
            >
                {React.cloneElement(child, props)}
            </ATFormButtonDialogWrapperDialog>
        )
    }

    const onHandleDialogClose = () => {
        setDialog(null)
    }

    return (
        <Grid size={size}>
            <ATFormButtonDialogStyledButton onClick={onInternalClick} {...config?.buttonProps}>
                {label}
            </ATFormButtonDialogStyledButton>
            {dialog}
        </Grid>
    )
}

export default ATFormButtonDialogWrapper
