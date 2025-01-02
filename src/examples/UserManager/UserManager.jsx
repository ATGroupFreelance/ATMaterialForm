import React, { useRef, useState } from 'react';

import ATAgGrid from '@/lib/component/ATAgGrid/ATAgGrid';
import { Columns } from './Columns';
import Button from '@/lib/component/ATForm/UI/Button/Button';
import RecordDialog from './RecordDialog';
import { ColumnDefTemplates } from '@/lib/component/ATAgGrid/ColumnDefTemplates/ColumnDefTemplates';
import { Grid2 } from '@mui/material';

const UserManager = () => {
    const [rowData, setRowData] = useState([{ id: 1, A: 10, B: 10, 'A + B': 20 }])
    const [dialog, setDialog] = useState(null)
    const idCounter = useRef(1)

    const handleClose = () => {
        setDialog(null)
    }

    const onAddClick = (event, { startLoading, stopLoading }) => {
        setDialog(
            <RecordDialog
                onSubmitClick={(event, { formDataKeyValue }) => {
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

    const onEditClick = (event, { startLoading, stopLoading, data }) => {
        setDialog(
            <RecordDialog
                defaultValue={data}
                onSubmitClick={(event, { formDataKeyValue }) => {
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

    const onRemoveClick = (event, { data }) => {
        setRowData(rowData.filter(item => item.id !== data.id))
    }

    const columnDefs = [
        ColumnDefTemplates.createRemove({ cellRendererParams: { onClick: onRemoveClick } }),
        ColumnDefTemplates.createEdit({ cellRendererParams: { onClick: onEditClick } }),
        ...Columns.map(item => {
            return {
                field: item.id,
                headerName: item.id,
            }
        }),
    ]

    return (
        <Grid2 size={12}>
            <ATAgGrid columnDefs={columnDefs} rowData={rowData} />
            <Button onClick={onAddClick} label={'Add'} />
            {dialog}
        </Grid2>
    )
}

export default UserManager;