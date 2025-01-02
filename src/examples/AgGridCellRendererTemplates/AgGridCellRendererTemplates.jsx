import React, { useEffect, useMemo, useState } from 'react';

import ATAgGrid from '@/lib/component/ATAgGrid/ATAgGrid';

const AgGridCellRendererTemplates = () => {
    const [rowData, setRowData] = useState(null)
    const columnDefs = useMemo(() => [
        { headerName: 'Make', field: 'make' },
        { headerName: 'Model', field: 'model' },
        { headerName: 'Price', field: 'price' }
    ], [])

    useEffect(() => {
        setRowData([
            { make: 'Toyota', model: 'Celica', price: 35000 },
            { make: 'Ford', model: 'Mondeo', price: 32000 },
            { make: 'Porsche', model: 'Boxster', price: 72000 }
        ])
    }, [])

    return (
        <ATAgGrid
            rowData={rowData}
            columnDefs={columnDefs}
        />
    )
}

export default AgGridCellRendererTemplates;