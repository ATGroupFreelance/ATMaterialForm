import { useCallback, useRef } from 'react';

//Context
import useATFormConfig from '../../../../hooks/useATFormConfig/useATFormConfig';
//Components
import ATAgGrid from '@/lib/component/ATAgGrid/ATAgGrid';
import Button from '../Button/Button';
import { Grid, Typography } from '@mui/material';
import { ATFormMultiSelectGridProps } from '@/lib/types/ui/MultiSelectGrid.type';
import { ATFormOnClickProps } from '@/lib/types/Common.type';

const DEFAULT_UNIQUE_KEY = 'AT_GRID_INDEX'

const MultiSelectGrid = ({ id, value, label, onChange, columnDefs, uniqueKey = DEFAULT_UNIQUE_KEY, onConfirmButtonClick, confirmButtonProps = {}, rowSelection, height = '50vh', ...restProps }: ATFormMultiSelectGridProps) => {
    void id;

    const { localText } = useATFormConfig()

    const ref = useRef<any>(null)

    const refCallback = useCallback((gridRef: any) => {
        if (gridRef) {
            ref.current = gridRef

            gridRef.api.forEachNode((node: any, nodeIndex: number) => {
                const found = value.find((item: any) => {
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

        const newValue = selectedRows.map((item: any) => {
            if (uniqueKey === DEFAULT_UNIQUE_KEY) {
                let result = null

                if (ref.current)
                    ref.current.api.forEachNode((node: any, nodeIndex: number) => {
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

    const onSelectionChanged = () => {
        if (onConfirmButtonClick && onChange)
            onChange({ target: { value: getNewValue() } })
    }

    const onInternalConfirmButtonClick = (props: ATFormOnClickProps) => {
        const newValue = getNewValue()

        if (onChange)
            onChange({ target: { value: newValue } })

        if (onConfirmButtonClick)
            onConfirmButtonClick({ ...props, value: [...newValue] })
    }

    return <div style={{ width: '100%' }}>
        {label && label !== '' &&
            <Grid container justifyContent={'center'} >
                <Typography variant='h6'>{label}</Typography>
            </Grid>
        }
        <ATAgGrid
            rowSelection={{
                mode: 'singleRow',
                enableSelectionWithoutKeys: true,
                isRowSelectable: () => false,
                ...rowSelection,
            }}
            columnDefs={[
                {
                    field: 'SelectionCheckbox',
                    headerName: '',
                    width: 60,
                    checkboxSelection: true,
                    headerCheckboxSelection: rowSelection?.mode === 'multiRow',
                },
                ...(columnDefs || []),
            ]}
            onGridReady={refCallback}
            onSelectionChanged={onSelectionChanged}
            height={height}
            {...restProps}
        />

        {onConfirmButtonClick &&
            <Grid container justifyContent={'center'} sx={{ marginTop: '7px' }}>
                <Grid size={6} {...(confirmButtonProps.wrapperRendererProps || {})}>
                    <Button
                        onClick={onInternalConfirmButtonClick}
                        color={'secondary'}
                        {...confirmButtonProps}
                        label={confirmButtonProps.label ? confirmButtonProps.label : localText['Apply Changes']}
                    />
                </Grid>
            </Grid>
        }
    </div>
}

export default MultiSelectGrid;