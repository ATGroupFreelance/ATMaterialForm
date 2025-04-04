import React, { useCallback, useRef } from 'react';

//Context
import useATFormProvider from '../../../../hooks/useATFormProvider/useATFormProvider';
//Components
import ATAgGrid from '@/lib/component/ATAgGrid/ATAgGrid';
import Button from '../Button/Button';
import { Grid, Typography } from '@mui/material';

const DEFAULT_UNIQUE_KEY = 'AT_GRID_INDEX'

const MultiSelectGrid = ({ atFormProvidedProps, id, value, label, onChange, columnDefs, uniqueKey = DEFAULT_UNIQUE_KEY, onConfirmButtonClick, confirmButtonProps = {}, rowSelection = 'multiple', height = '50vh', ...restProps }) => {
    const { localText } = useATFormProvider()

    const ref = useRef(null)

    const refCallback = useCallback((gridRef) => {
        if (gridRef) {
            ref.current = gridRef

            gridRef.api.forEachNode((node, nodeIndex) => {
                const found = value.find((item) => {
                    return uniqueKey === DEFAULT_UNIQUE_KEY ? nodeIndex === item : String(node.data[uniqueKey]) === String(item)
                })

                if (found)
                    node.setSelected(true);
            });
        }

        // eslint-disable-next-line
    }, [value])

    const getNewValue = () => {
        const selectedRows = ref.current.api.getSelectedRows()

        const newValue = selectedRows.map((item, index) => {
            if (uniqueKey === DEFAULT_UNIQUE_KEY) {
                let result = null

                ref.current.api.forEachNode((node, nodeIndex) => {
                    if (node.data === item)
                        result = nodeIndex
                })

                return result
            }
            else
                return item[uniqueKey]
        })

        return newValue
    }

    const onSelectionChanged = (changedRow) => {
        if (!onConfirmButtonClick)
            onChange({ target: { value: getNewValue() } })
    }

    const onInternalConfirmButtonClick = (event, { ...props }) => {
        const newValue = getNewValue()

        onChange({ target: { value: newValue } })

        onConfirmButtonClick(event, { ...props, value: [...newValue] })
    }

    return <div style={{ width: '100%' }}>
        {label && label !== '' &&
            <Grid container justifyContent={'center'} >
                <Typography variant='h6'>{label}</Typography>
            </Grid>
        }
        <ATAgGrid
            rowSelection={rowSelection}
            isRowSelectable={false}
            rowMultiSelectWithClick={true}
            columnDefs={[
                {
                    field: 'SelectionCheckbox',
                    headerName: '',
                    width: 60,
                    checkboxSelection: true,
                    headerCheckboxSelection: rowSelection === 'multiple',
                },
                ...columnDefs,
            ]}
            onGridReady={refCallback}
            onSelectionChanged={onSelectionChanged}
            height={height}
            {...restProps}
        />

        {onConfirmButtonClick &&
            <Grid container justifyContent={'center'} sx={{ marginTop: '7px' }}>
                <Grid size={6} {...(confirmButtonProps.wrapperRendererProps || {})}>
                    <Button onClick={onInternalConfirmButtonClick} {...confirmButtonProps} label={confirmButtonProps.label ? confirmButtonProps.label : localText['Apply Changes']} color={'secondary'} />
                </Grid>
            </Grid>
        }
    </div>
}

export default MultiSelectGrid;