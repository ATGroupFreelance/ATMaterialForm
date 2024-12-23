import React, { useContext } from 'react';

import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
//Context
import ATFormContext from '../ATForm/ATFormContext/ATFormContext';
//Utils
import { getTitleByEnums } from '../ATForm/UITypeUtils/UITypeUtils';

import {
    ClientSideRowModelModule,
    ClientSideRowModelApiModule,
    ValidationModule,
    LocaleModule,
    themeBalham,
    RowApiModule,
    TextFilterModule,
    NumberFilterModule
} from 'ag-grid-community';

const ATAgGrid = ({ ref, rowData, columnDefs, height, domLayout, ...restProps }) => {

    const { rtl, enums, agGridLocalText, getLocalText } = useContext(ATFormContext)

    const newColumnDefs = []

    if (columnDefs) {
        for (let i = 0; i < columnDefs.length; i++) {
            const { enumID, enumOptions, headerName, ...restColumnDefs } = columnDefs[i]

            newColumnDefs.push({
                headerName: ((headerName === undefined) || (headerName === null)) ? getLocalText(columnDefs[i].field) : headerName,
                valueFormatter: (params) => {
                    return getTitleByEnums({ id: enumID || params.colDef.field, enums, value: params.value, options: enumOptions })
                },
                ...restColumnDefs
            })
        }

    }

    return <div className="ag-theme-alpine" style={{ height: domLayout ? undefined : (height || '80vh'), width: '100%' }}>
        <AgGridReact
            theme={themeBalham}
            ref={ref}
            rowData={rowData}
            columnDefs={newColumnDefs}
            localeText={agGridLocalText}
            rowHeight={48}
            enableRtl={rtl}
            domLayout={domLayout}
            modules={[
                ClientSideRowModelModule,
                ClientSideRowModelApiModule,
                ValidationModule,
                LocaleModule,
                RowApiModule,
                TextFilterModule,
                NumberFilterModule
            ]}
            {...restProps}
        />
    </div>
}

export default ATAgGrid;