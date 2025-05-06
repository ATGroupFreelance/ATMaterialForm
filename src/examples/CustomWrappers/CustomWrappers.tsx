import React, { useState } from 'react';
import { ATForm, formBuilder, formBuilderUtils } from "@/lib";
import { Button, Grid } from '@mui/material';
import { ExampleComponentInterface } from '@/App';

const MyWrapperTypeA = ({ childProps, children, isValidNumber, onClick }: any) => {
    console.log('CustomWrappers A')
    return <Grid size={childProps.size}>
        <div style={{ border: '1px dotted red', padding: '5px' }}>
            isValidNumber ? {String(isValidNumber)}
            <Button onClick={onClick}>Click Me!</Button>
            {children}
        </div>
    </Grid>
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

    return <Grid size={gridSize}>
        <div style={{ border: '1px dotted red', padding: '5px' }}>
            isValidNumber ? {String(isValidNumber)}
            <Button onClick={onWrapperClick}>Click Me!</Button>
            {React.cloneElement(children, { ...childProps, onChange: onTextBoxChange })}
        </div>
    </Grid>
}

const CustomWrappers = ({ ref, onChange }: ExampleComponentInterface) => {
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
        <ATForm ref={ref} validationDisabled={false}>
            {
                formBuilderUtils.createColumnBuilder(
                    [
                        formBuilder.createTextBox({
                            id: 'TextBoxWithWrapperA',
                            size: gridSize,
                            wrapperRenderer: MyWrapperTypeA,
                            wrapperRendererProps: {
                                isValidNumber,
                                onClick: onWrapperTypeAClick
                            },
                        }, { onChange: onTextBoxChange, }),
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
}

export default CustomWrappers;