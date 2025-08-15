import Button from '../../UI/Button/Button'
import { Grid } from '@mui/material'
import { ATFormButtonDialogWrapperProps } from '@/lib/types/template-wrappers/ButtonDialogWrapper'
import React, { useRef, useState } from 'react'
import ATFormButtonDialogWrapperDialog from './ATFormButtonDialogWrapperDialog/ATFormButtonDialogWrapperDialog'
import { ATFormOnChildChangeInterface } from '@/lib/types/ATForm.type'

const ATFormButtonDialogWrapper = ({ children, childProps, ...restProps }: ATFormButtonDialogWrapperProps) => {
    const [dialog, setDialog] = useState<any>(null)
    const mLastSavedValue = useRef(childProps.tProps.defaultValue)
    const { size = 12, label = "Open" } = childProps.tProps

    const onChange = ({ event }: ATFormOnChildChangeInterface) => {
        console.log('ATFormButtonDialogWrapper ', { event })
        mLastSavedValue.current = event.target.value
    }

    console.log('ATFormButtonDialogWrapper', { children, childProps, restProps })

    const onInternalClick = () => {
        //@ts-ignore
        const child: any = children
        const props = {
            childProps: {
                ...childProps,
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
            <Button onClick={onInternalClick} {...restProps}>
                {label}
            </Button>
            {dialog}
        </Grid>
    )
}

export default ATFormButtonDialogWrapper
