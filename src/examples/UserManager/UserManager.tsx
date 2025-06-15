import { useRef, useState } from 'react';

import ATAgGrid from '@/lib/component/ATAgGrid/ATAgGrid';
import { Columns } from './Columns';
import Button from '@/lib/component/ATForm/UI/Button/Button';
import RecordDialog from './RecordDialog';
import { ColumnDefTemplates } from '@/lib/component/ATAgGrid/ColumnDefTemplates/ColumnDefTemplates';
import { Grid } from '@mui/material';
import { ATFormOnClickType } from '@/lib/types/Common.type';

const UserManager = () => {
    const [rowData, setRowData] = useState([{ id: 1, A: 10, B: 10, 'A + B': 20 }])
    const [dialog, setDialog] = useState<any>(null)
    const idCounter = useRef(1)

    const handleClose = () => {
        setDialog(null)
    }

    const onAddClick: ATFormOnClickType = () => {
        setDialog(
            <RecordDialog
                onSubmitClick={({ formDataKeyValue }: any) => {
                    idCounter.current = idCounter.current + 1
                    setRowData([
                        ...rowData,
                        {
                            id: idCounter.current,
                            ...formDataKeyValue,
                        },
                    ])
                    handleClose()
                }}
                onClose={handleClose}
            />
        )
    }

    const onEditClick: ATFormOnClickType = ({ data }) => {
        setDialog(
            <RecordDialog
                defaultValue={data}
                onSubmitClick={({ formDataKeyValue }: any) => {
                    const foundIndex = rowData.findIndex(item => item.id === data.id)

                    const newRowData = [
                        ...rowData
                    ]

                    newRowData[foundIndex] = {
                        ...newRowData[foundIndex],
                        ...formDataKeyValue
                    }

                    console.log('Edit newRowData', {
                        newRowData,
                        foundIndex,
                    })

                    setRowData(newRowData)
                    handleClose()
                }}
                onClose={handleClose}
            />
        )
    }

    const onRemoveClick: ATFormOnClickType = ({ data }) => {
        setRowData(rowData.filter(item => item.id !== data.id))
    }

    const columnDefs = [
        ColumnDefTemplates.createRemove({ cellRendererParams: { config: { onClick: onRemoveClick } } }),
        ColumnDefTemplates.createEdit({ cellRendererParams: { config: { onClick: onEditClick } } }),
        ...Columns.map(item => {
            return {
                field: item.tProps.id,
                headerName: item.tProps.id
            }
        }),
    ]

    return (
        <Grid size={12}>
            <ATAgGrid columnDefs={columnDefs} rowData={rowData} />
            <Button onClick={onAddClick} label={'Add'} />
            {dialog}
        </Grid>
    )
}

export default UserManager;