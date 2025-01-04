import _React, { useContext, useState } from 'react';

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
    NumberFilterModule,
    ColDef
} from 'ag-grid-community';
import { ATAgGridExtendedColDef, ATAgGridProps, ATAgGridTColumnInterface } from '@/lib/types/ATAgGrid';
import { ColumnDefTemplates } from './ColumnDefTemplates/ColumnDefTemplates';
import ATFormDialog from '../ATForm/ATFormDialog';
import { ATButtonOnClickHandler } from '@/lib/types/Button';

const ATAgGrid = ({ atFormProvidedProps, id, label, ref, rowData, columnDefs, height, domLayout, tColumns, ...restProps }: ATAgGridProps) => {
    /**Ignore unused variables using void */
    void atFormProvidedProps;
    void id;
    void label;

    const [dialog, setDialog] = useState<any>(null)

    const { rtl, enums, agGridLocalText, getLocalText } = useContext(ATFormContext)

    const newColumnDefs: ColDef[] = []

    if (columnDefs) {
        for (let i = 0; i < columnDefs.length; i++) {
            const { field, enumID, enumOptions, headerName, ...restColumnDefs }: ATAgGridExtendedColDef = columnDefs[i]

            newColumnDefs.push({
                field,
                headerName: ((headerName === undefined) || (headerName === null)) ? getLocalText(field) : headerName,
                valueFormatter: (params: any) => {
                    return getTitleByEnums({ id: enumID || params.colDef.field, enums, value: params.value, options: enumOptions })
                },
                ...restColumnDefs
            })
        }
    }

    const onTColumnFormDialogClick: ATButtonOnClickHandler<{ data?: any, tColumn: ATAgGridTColumnInterface }> = (_event, { data, tColumn }) => {
        setDialog(
            <ATFormDialog
                ref={undefined}
                title={undefined}
                titleStyle={undefined}
                onClose={handleDialogClose}
                onCancelClick={undefined}
                onSubmitClick={undefined}
                onChange={undefined}
                submitLoading={undefined}
                cancelLoading={undefined}
                getActions={undefined}
                loading={undefined}
                submitButtonProps={undefined}
                cancelButtonProps={undefined}
                fullWidth={undefined}
                maxWidth={undefined}
                PaperProps={undefined}
                {...tColumn?.typeProps || {}}
            />
        )
    }

    const handleDialogClose = () => {
        setDialog(null)
    }

    const tColumnTypes = {
        'FormDialog': (currentTColumn: ATAgGridTColumnInterface) => {
            const { cellRendererParams, ...restColProps } = currentTColumn.colProps || {}
            return ColumnDefTemplates.createButton({
                field: currentTColumn.id,
                headerName: ((currentTColumn.colProps?.headerName === undefined) || (currentTColumn.colProps?.headerName === null)) ? getLocalText(currentTColumn.id) : currentTColumn.colProps?.headerName,
                cellRendererParams: {
                    onClick: (event, props) => onTColumnFormDialogClick(event, { ...props, tColumn: currentTColumn }),
                    ...cellRendererParams
                },
                ...restColProps
            })
        }
    }

    // Handle tColumns to add new definitions at the specified index
    if (tColumns) {
        for (let j = 0; j < tColumns.length; j++) {
            const currentTColumn = tColumns[j]

            // Create the new column definition
            const newColumn = tColumnTypes[currentTColumn.type](currentTColumn)

            // Insert the column at the specified index
            if (currentTColumn?.index >= 0 && currentTColumn?.index < newColumnDefs.length) {
                newColumnDefs.splice(currentTColumn.index, 0, newColumn)
            } else {
                newColumnDefs.push(newColumn)
            }
        }
    }

    return <div style={{ height: domLayout ? undefined : (height || '80vh'), width: '100%' }}>
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
        {dialog}
    </div>
}

export default ATAgGrid;