import React, { useState } from 'react';
import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';
import { Button, Grid2 } from '@mui/material';

const MyWrapperTypeA = ({ childProps, children, isValidNumber, onClick }: any) => {
    console.log('CustomWrappers A')
    return <Grid2 size={childProps.size}>
        <div style={{ border: '1px dotted red', padding: '5px' }}>
            isValidNumber ? {String(isValidNumber)}
            <Button onClick={onClick}>Click Me!</Button>
            {children}
        </div>
    </Grid2>
}

const MyWrapperTypeB = ({ childProps, children }: any) => {
    console.log('CustomWrappers B')
    const [isValidNumber, setIsValidNumber] = useState(false)
    const [gridSize, setGridSize] = useState(12)

    const onWrapperClick = () => {
        setGridSize((prevState) => {
            return prevState === 12 ? 6 : 12
        })
    }

    const onTextBoxChange = (event: any) => {
        setIsValidNumber(!isNaN(event.target.value))
    }

    return <Grid2 size={gridSize}>
        <div style={{ border: '1px dotted red', padding: '5px' }}>
            isValidNumber ? {String(isValidNumber)}
            <Button onClick={onWrapperClick}>Click Me!</Button>
            {React.cloneElement(children, { ...childProps, onChange: onTextBoxChange })}
        </div>
    </Grid2>
}

const CustomWrappers = React.forwardRef<ATForm, any>(({ onChange }: any, forwardRef) => {
    const [isValidNumber, setIsValidNumber] = useState(false)
    const [gridSize, setGridSize] = useState(12)

    const onTextBoxChange = (event: any) => {
        setIsValidNumber(!isNaN(event.target.value))
    }

    const onWrapperTypeAClick = () => {
        setGridSize((prevState) => {
            return prevState === 12 ? 6 : 12
        })
    }


    console.log('CustomWrappers')

    return (
        <ATForm ref={forwardRef} validationDisabled={false}>
            {
                formBuilder.createColumnBuilder(
                    [
                        // formBuilder.createTextBox({
                        //     id: 'TextBoxWithWrapperA',
                        //     size: gridSize,
                        //     onChange: onTextBoxChange,
                        //     wrapperRenderer: MyWrapperTypeA,
                        //     wrapperRendererProps: {
                        //         isValidNumber,
                        //         onClick: onWrapperTypeAClick
                        //     },
                        // }),
                        formBuilder.createTextBox({
                            id: 'TextBoxWithWrapperB',
                            size: 12,
                            wrapperRenderer: MyWrapperTypeB,
                        })
                    ]
                )
                    .build()
            }
        </ATForm>
    )
})

export default CustomWrappers;