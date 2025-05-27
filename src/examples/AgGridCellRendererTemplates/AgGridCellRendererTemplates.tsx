import { useEffect, useMemo, useState } from 'react';

import ATAgGrid from '@/lib/component/ATAgGrid/ATAgGrid';
import { ATAgGridCellRendererOnClickProps, ATAgGridCustomCellRendererProps } from '@/lib/types/at-ag-grid/ATAgGrid.type';
import { ColumnDefTemplates } from '@/lib/component/ATAgGrid/ColumnDefTemplates/ColumnDefTemplates';

const TestCellRenderer = (props: ATAgGridCustomCellRendererProps) => {
    console.log('TestCellRenderer props:', props);
    return <div>
        {props.value}
    </div>
}

const AgGridCellRendererTemplates = () => {
    const [rowData, setRowData] = useState<any>(null)

    const onEditClick = (props: ATAgGridCellRendererOnClickProps) => {
        console.log('onEditClick props:', props);
    }

    const columnDefs = useMemo(() => [
        { headerName: 'Make', field: 'make' },
        { headerName: 'Model', field: 'model' },
        { headerName: 'Price', field: 'price' },
        {
            field: 'test',
            headerName: 'Test',
            cellRenderer: TestCellRenderer,
        },
        ColumnDefTemplates.createEdit({ cellRendererParams: { config: { onClick: onEditClick } } }),
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
            tColumns={[
                {
                    id: 'Show_Index1',
                    type: 'FormDialog',
                    index: 1,
                    colProps: {
                        cellRendererParams: {
                            color: 'error'
                        },
                    },
                    typeProps: {
                        title: "Show Index 1 Dialog",
                        children: [
                            {
                                id: 'Name',
                                type: 'TextBox'
                            }
                        ]
                    }
                },
                {
                    id: 'Show_NoIndex',
                    type: 'FormDialog',
                }
            ]}
        />
    )
}

export default AgGridCellRendererTemplates;