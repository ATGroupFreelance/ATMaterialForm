// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _React, { useCallback, useMemo, useState } from 'react';

import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
//Utils
import { getTitleByEnums } from '../ATForm/UITypeUtils/UITypeUtils';

import {
    ClientSideRowModelModule,
    ClientSideRowModelApiModule,
    /**Only in dev mode */
    ValidationModule,
    LocaleModule,
    RowApiModule,
    TextFilterModule,
    NumberFilterModule,
    ColDef,
    themeBalham,
    PaginationModule,
    CellContextMenuEvent
} from 'ag-grid-community';
import { useTheme } from '@mui/material';
//ATForm
import { ATAgGridExtendedColDef, ATAgGridProps, ATAgGridTColumnInterface } from '../../types/at-ag-grid/ATAgGrid.type';
import useATFormConfig from '../../hooks/useATFormConfig/useATFormConfig';
//Components
import { ColumnDefTemplates } from './ColumnDefTemplates/ColumnDefTemplates';
import ATFormDialog from '../ATForm/ATFormDialog';
import ATAgGridContextMenu from './ATAgGridContextMenu/ATAgGridContextMenu';
import { ATFormOnClickProps, ATFormOnClickType } from '@/lib/types/Common.type';

const ATAgGrid = ({ ref, rowData, columnDefs, height, domLayout, tColumns, uniqueKey, translateUniqueKey, ...restProps }: ATAgGridProps) => {
    const theme = useTheme()
    const { rtl, enums, agGridLocalText, getLocalText } = useATFormConfig()
    const [contextMenu, setContextMenu] = useState<any>(null)

    const [dialog, setDialog] = useState<any>(null)

    const onTColumnFormDialogClick: ATFormOnClickType<{ data?: any, tColumn: ATAgGridTColumnInterface }> = useCallback(({ tColumn }) => {
        setDialog(
            <ATFormDialog
                onClose={handleDialogClose}
                {...tColumn?.typeProps || {}}
            />
        )
    }, [])

    const handleDialogClose = () => {
        setDialog(null)
    }

    const tColumnTypes = useMemo(() => {
        return {
            'FormDialog': (currentTColumn: ATAgGridTColumnInterface) => {
                const { cellRendererParams, ...restColProps } = currentTColumn.colProps || {}
                return ColumnDefTemplates.createButton({
                    field: currentTColumn.id,
                    headerName: ((currentTColumn.colProps?.headerName === undefined) || (currentTColumn.colProps?.headerName === null)) ? getLocalText(currentTColumn.id) ?? undefined : currentTColumn.colProps?.headerName,
                    cellRendererParams: {
                        onClick: (props: ATFormOnClickProps) => onTColumnFormDialogClick({ ...props, tColumn: currentTColumn }),
                        ...cellRendererParams
                    },
                    ...restColProps
                })
            }
        }
    }, [getLocalText, onTColumnFormDialogClick])

    const basicColumnDefs: ColDef[] = useMemo(() => {
        const result: ColDef[] = []

        if (columnDefs) {
            for (let i = 0; i < columnDefs.length; i++) {
                const { field, enumsKey, enumOptions, headerName, ...restColumnDefs }: ATAgGridExtendedColDef = columnDefs[i]

                result.push({
                    field,
                    headerName: ((headerName === undefined) || (headerName === null)) ? getLocalText(field) ?? undefined : headerName,
                    /**Do not translate uniqueKey columns unless translateUniqueKey is true*/
                    valueFormatter: (field === uniqueKey && !translateUniqueKey) ?
                        undefined
                        :
                        (params: any) => {
                            const enumValue = getTitleByEnums({ id: enumsKey || params.colDef.field, enums, value: params.value, options: enumOptions })

                            if (enumValue && enumValue !== params.value)
                                return enumValue
                            else
                                return getLocalText(params.value) ?? params.value
                        },
                    ...restColumnDefs
                })
            }
        }

        return result
    }, [enums, translateUniqueKey, uniqueKey, columnDefs, getLocalText])

    const basicColumnDefs2: ColDef[] = useMemo(() => {
        const result = [
            ...basicColumnDefs
        ]

        // Handle tColumns to add new definitions at the specified index
        if (tColumns) {
            for (let j = 0; j < tColumns.length; j++) {
                const currentTColumn = tColumns[j]

                // Create the new column definition
                const newColumn = tColumnTypes[currentTColumn.type](currentTColumn)

                // Insert the column at the specified index
                if (currentTColumn.index !== undefined && currentTColumn?.index >= 0 && currentTColumn?.index < result.length) {
                    result.splice(currentTColumn.index, 0, newColumn)
                } else {
                    result.push(newColumn)
                }
            }
        }

        return result;
    }, [basicColumnDefs, tColumns, tColumnTypes])

    // const basicColumnDefs3: ColDef[] = useMemo(() => {
    //     const result: ColDef[] = [
    //         ...basicColumnDefs2
    //     ]

    //     if (!rowData?.length)
    //         return result

    //     const colDefsWidth: { [key: string]: any } = {}

    //     for (let i = 0; i < Math.min(rowData.length - 1, 100); i++) {
    //         const currentRowData = rowData[i]

    //         result.filter(colDef => !colDef.width).forEach(colDef => {
    //             if (colDef.field && !colDef.width) {
    //                 const currentCell = currentRowData[colDef.field]
    //                 const currentLength = Math.max(currentCell?.length || 0, colDef.field?.length || 0, 0)

    //                 const { field } = colDef
    //                 const minWidth = 20
    //                 const newWidth = minWidth + currentLength * 13

    //                 colDefsWidth[field] = Math.max((colDefsWidth[field] || 0), newWidth)
    //             }
    //         })
    //     }

    //     result.filter(colDef => colDef.field && !colDef.width).forEach(colDef => {
    //         if (!colDef.width && !colDef.minWidth)
    //             colDef.minWidth = Math.max(colDefsWidth[colDef.field!], 100)
    //     })

    //     return result
    // }, [rowData, basicColumnDefs2])  

    const onContextMenu = (agEvent: CellContextMenuEvent) => {
        console.log('onContextMenu Main', agEvent)
        const mouseEvent = agEvent.event as MouseEvent;

        if (!mouseEvent?.clientX || !mouseEvent.clientY)
            return null

        mouseEvent.preventDefault()
        mouseEvent.stopPropagation()
        mouseEvent.stopImmediatePropagation()

        setContextMenu(
            agEvent
        );
    };

    const onContextMenuClose = () => {
        setContextMenu(null)
    }


    return <div
        style={{ height: domLayout ? undefined : (height || '80vh'), width: '100%' }}
        onContextMenu={(event) => {
            // Prevent the browser's default context menu, using aggrid suppressContextMenu or onContextMenu prevent default did not work!!!
            event.preventDefault();
        }}
    >
        <AgGridReact
            //@ts-ignore
            theme={theme?.atConfig?.gridTheme || themeBalham}
            ref={ref}
            rowData={rowData}
            columnDefs={basicColumnDefs2}
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
                NumberFilterModule,
                // ColumnAutoSizeModule,
                PaginationModule
            ]}
            getRowId={uniqueKey ? (params) => String(params.data[uniqueKey]) : undefined}
            defaultColDef={{
                filter: true,
            }}
            onCellContextMenu={onContextMenu}
            {...restProps}
        />
        <ATAgGridContextMenu
            agEvent={contextMenu}
            onClose={onContextMenuClose}
        />
        {dialog}
    </div>
}

export default ATAgGrid;