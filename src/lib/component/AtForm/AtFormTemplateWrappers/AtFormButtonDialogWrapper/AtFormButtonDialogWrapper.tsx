import { Grid } from '@mui/material'
import { AtFormButtonDialogWrapperProps } from '../../../../types/template-wrappers/ButtonDialogWrapper.type'
import React, { ReactElement, useImperativeHandle, useRef, useState } from 'react'
import AtFormButtonDialogWrapperDialog from './AtFormButtonDialogWrapperDialog/AtFormButtonDialogWrapperDialog'
import { AtFormChildResetInterface, AtFormOnChildChangeInterface } from '../../../../types/AtForm.type'
import useAtForm from '../../../../hooks/useAtForm/useAtForm'
import { getInitialValue } from '../../UiBuilder/ControlledUiBuilder/ControlledUiBuilder'
import AtFormButtonDialogStyledButton from './AtFormButtonDialogStyledButton/AtFormButtonDialogStyledButton'

const AtFormButtonDialogWrapper = ({ children, childProps, config }: AtFormButtonDialogWrapperProps) => {
    const [dialog, setDialog] = useState<any>(null)
    const mLastSavedValue = useRef(childProps.isFormControlled ? childProps.value : childProps.tProps.defaultValue)
    const { getFormData } = useAtForm()
    const mChangeId = useRef<number>(0)

    const mChildRef = useRef<{ reset: (props?: AtFormChildResetInterface) => void }>(null)

    const { size = 12, label = "Open" } = childProps.tProps

    const internalReset = ({ suppressFormOnChange = false }: AtFormChildResetInterface = {} as AtFormChildResetInterface) => {
        const newValue = getInitialValue(childProps.typeInfo!, childProps.tProps?.defaultValue)

        if (childProps.isFormControlled)
            mChangeId.current = mChangeId.current + 1

        childProps.onChildChange({ event: { target: { value: newValue } }, suppressFormOnChange, childProps, changeId: mChangeId.current })
    }

    //Overwrite form child reset with our own reset.
    useImperativeHandle(childProps.tProps.ref, () => {
        return {
            reset: internalReset,
        }
    })

    const onChange = ({ event }: AtFormOnChildChangeInterface) => {
        mLastSavedValue.current = event.target.value
    }

    const onInternalClick = () => {
        const lastValue = getFormData().formDataSemiKeyValue?.[childProps.tProps.id]
        const child: ReactElement = children

        //We remove ref from tProps because we don't want to pass the ref down to the child component                
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
            <AtFormButtonDialogWrapperDialog
                onClose={onHandleDialogClose}
                onSubmitClick={() => {
                    //Apply the change.
                    if (childProps.onChildChange) {
                        if (childProps.isFormControlled)
                            mChangeId.current = mChangeId.current + 1

                        childProps.onChildChange({ event: { target: { value: mLastSavedValue.current } }, childProps, changeId: mChangeId.current })

                        onHandleDialogClose()
                    }
                }}
                onResetClick={() => {
                    mChildRef.current?.reset()
                }}
            >
                {React.cloneElement(child, props)}
            </AtFormButtonDialogWrapperDialog>
        )
    }

    const onHandleDialogClose = () => {
        setDialog(null)
    }

    return (
        <Grid size={size}>
            <AtFormButtonDialogStyledButton onClick={onInternalClick} {...config?.buttonProps}>
                {label}
            </AtFormButtonDialogStyledButton>
            {dialog}
        </Grid>
    )
}

export default AtFormButtonDialogWrapper
