import { useCallback, useRef } from 'react';

//Context
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';
//Components
import AtAgGrid from '../../../AtAgGrid/AtAgGrid';
import Button from '../Button/Button';
import { Grid, Typography } from '@mui/material';
import { AtFormMultiSelectGridProps } from '../../../../types/ui/MultiSelectGrid.type';
import { AtFormOnClickProps } from '../../../../types/Common.type';

const DEFAULT_UNIQUE_KEY = 'AT_GRID_INDEX'

const MultiSelectGrid = ({ id, value, label, onChange, columnDefs, uniqueKey = DEFAULT_UNIQUE_KEY, onConfirmButtonClick, confirmButtonProps = {}, rowSelection, height = '50vh', ...restProps }: AtFormMultiSelectGridProps) => {
    void id;

    const { localText } = useAtFormConfig()

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

    }, [value, uniqueKey])

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

    const onInternalConfirmButtonClick = (props: AtFormOnClickProps) => {
        const newValue = getNewValue()

        if (onChange)
            onChange({ target: { value: newValue } })

        if (onConfirmButtonClick)
            onConfirmButtonClick({ ...props, value: [...newValue] })
    }

    return <div style={{ width: '100%' }}>
        {label && label !== '' &&
            <Grid container sx={{ justifyContent: 'center' }} >
                <Typography variant='h6'>{label}</Typography>
            </Grid>
        }
        <AtAgGrid
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
            <Grid container sx={{ marginTop: '7px', justifyContent: 'center' }}>
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