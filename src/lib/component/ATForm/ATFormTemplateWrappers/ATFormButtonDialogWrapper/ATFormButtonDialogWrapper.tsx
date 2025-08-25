import Button from '../../UI/Button/Button'
import { Grid } from '@mui/material'
import { ATFormButtonDialogWrapperProps } from '@/lib/types/template-wrappers/ButtonDialogWrapper.type'
import React, { useRef, useState } from 'react'
import ATFormButtonDialogWrapperDialog from './ATFormButtonDialogWrapperDialog/ATFormButtonDialogWrapperDialog'
import { ATFormOnChildChangeInterface } from '@/lib/types/ATForm.type'

const ATFormButtonDialogWrapper = ({ children, childProps, config }: ATFormButtonDialogWrapperProps) => {
    const [dialog, setDialog] = useState<any>(null)
    const mLastSavedValue = useRef(childProps.isFormControlled ? childProps.value : childProps.tProps.defaultValue)
    const { size = 12, label = "Open" } = childProps.tProps

    const onChange = ({ event }: ATFormOnChildChangeInterface) => {
        console.log('ATFormButtonDialogWrapper ', { event })
        mLastSavedValue.current = event.target.value
    }

    const onInternalClick = () => {
        mLastSavedValue.current = childProps.isFormControlled ? childProps.value : childProps.tProps.defaultValue

        //@ts-ignore
        const child: any = children
        const props = {
            childProps: {
                ...childProps,
                isFormControlled: false,
                tProps: {
                    ...childProps.tProps,
                    defaultValue: mLastSavedValue.current,
                },
                onChildChange: onChange
            }
        }

        setDialog(
            <ATFormButtonDialogWrapperDialog
                onClose={onHandleDialogClose}
                onSubmitClick={() => {
                    if (childProps.onChildChange) {
                        childProps.onChildChange({ event: { target: { value: mLastSavedValue.current } }, childProps })

                        onHandleDialogClose()
                    }
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
            <Button onClick={onInternalClick} {...config?.buttonProps}>
                {label}
            </Button>
            {dialog}
        </Grid>
    )
}

export default ATFormButtonDialogWrapper
