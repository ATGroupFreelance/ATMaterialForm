import _React, { useCallback, useMemo, useState } from 'react';

import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
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
    type GetLocaleText,
    PaginationModule,
    CellContextMenuEvent,
    RowSelectionModule,
    DateFilterModule,
    AutoGenerateColumnsModule
} from 'ag-grid-community';
import { useTheme } from '@mui/material/styles';
//ATForm
import { AtAgGridExtendedColDef, AtAgGridProps, AtAgGridTColumnInterface } from '../../types/at-ag-grid/AtAgGrid.type';
import useAtFormConfig from '../../hooks/useAtFormConfig/useAtFormConfig';
//Components
import { ColumnDefTemplates } from './ColumnDefTemplates/ColumnDefTemplates';
import AtFormDialog from '../AtForm/AtFormDialog';
import AtAgGridContextMenu from './AtAgGridContextMenu/AtAgGridContextMenu';
import { AtFormOnClickProps, AtFormOnClickType } from '../../types/Common.type';
import { atAgGridDarkFallback, atAgGridLightFallback } from './theme/AtAgGridFallbackThemes';
import { useAtAgGridTheme } from './theme/AtAgGridThemeContext';
import { resolveAgGridHeaderName } from './resolveAgGridHeaderName';
import { resolveEnumItemDisplayTitle } from '../../enum/resolveEnumItemDisplayTitle';

const AT_AG_GRID_MODULES = [
    ClientSideRowModelModule,
    ClientSideRowModelApiModule,
    ValidationModule,
    LocaleModule,
    RowApiModule,
    TextFilterModule,
    NumberFilterModule,
    PaginationModule,
    RowSelectionModule,
    DateFilterModule,
    AutoGenerateColumnsModule,
];

const AtAgGrid = ({ ref, rowData, columnDefs, height, domLayout, tColumns, uniqueKey, translateUniqueKey, ...restProps }: AtAgGridProps) => {
    const muiTheme = useTheme();
    const { rtl, enums, localizationRevision, agGridTheme: legacyAgGridTheme, t } = useAtFormConfig();
    const injectedAgGridTheme = useAtAgGridTheme();
    const resolvedAgGridTheme = injectedAgGridTheme ?? legacyAgGridTheme ?? (muiTheme.palette.mode === 'dark' ? atAgGridDarkFallback : atAgGridLightFallback)
    const [contextMenu, setContextMenu] = useState<any>(null)

    const [dialog, setDialog] = useState<any>(null)

    const handleDialogClose = useCallback(() => {
        setDialog(null)
    }, [])

    const onTColumnFormDialogClick: AtFormOnClickType<{ data?: any, tColumn: AtAgGridTColumnInterface }> = useCallback(({ tColumn }) => {
        setDialog(
            <AtFormDialog
                onClose={handleDialogClose}
                {...tColumn?.typeProps || {}}
            />
        )
    }, [handleDialogClose])

    const tColumnTypes = useMemo(() => {
        return {
            'FormDialog': (currentTColumn: AtAgGridTColumnInterface) => {
                const { cellRendererParams, ...restColProps } = currentTColumn.colProps || {}
                return ColumnDefTemplates.createButton({
                    field: currentTColumn.id,
                    headerName: resolveAgGridHeaderName({
                        field: currentTColumn.id,
                        headerName: currentTColumn.colProps?.headerName,
                        disableHeaderLocalization: currentTColumn.colProps?.disableHeaderLocalization,
                        t,
                    }),
                    cellRendererParams: {
                        onClick: (props: AtFormOnClickProps) => onTColumnFormDialogClick({ ...props, tColumn: currentTColumn }),
                        ...cellRendererParams
                    },
                    ...restColProps
                })
            }
        }
    }, [t, onTColumnFormDialogClick])

    const basicColumnDefs: ColDef[] = useMemo(() => {
        const result: ColDef[] = []

        if (columnDefs) {
            for (let i = 0; i < columnDefs.length; i++) {
                const { field, enumsKey, enumOptions, headerName, disableHeaderLocalization, ...restColumnDefs }: AtAgGridExtendedColDef = columnDefs[i]

                result.push({
                    field,
                    headerName: resolveAgGridHeaderName({
                        field,
                        headerName,
                        disableHeaderLocalization,
                        t,
                    }),
                    /**Do not translate uniqueKey columns unless translateUniqueKey is true*/
                    valueFormatter: (field === uniqueKey && !translateUniqueKey) ?
                        undefined
                        :
                        (params: any) => {
                            const enumItems = enumOptions || enums?.[enumsKey || params.colDef.field]
                            const enumItem = enumItems?.find((item: any) => String(item.id) === String(params.value))

                            if (enumItem) {
                                return resolveEnumItemDisplayTitle({
                                    enumKey: enumsKey || field,
                                    item: enumItem,
                                    t,
                                });
                            }

                            return typeof params.value === 'string'
                                ? t(params.value, params.value) ?? params.value
                                : params.value
                        },
                    ...restColumnDefs
                })
            }
        }

        return result
    }, [enums, translateUniqueKey, uniqueKey, columnDefs, t])

    const basicColumnDefs2: ColDef[] = useMemo(() => {
        const result = [
            ...basicColumnDefs
        ]

        // Handle tColumns to add new definitions at the specified index
        if (tColumns) {
            for (let j = 0; j < tColumns.length; j++) {
                const currentTColumn = tColumns[j]

                if (!currentTColumn)
                    continue;

                const tColumnFactory = tColumnTypes[currentTColumn.type as keyof typeof tColumnTypes];
                if (!tColumnFactory) {
                    console.warn('Unsupported ATForm AG Grid tColumn type', currentTColumn.type);
                    continue;
                }

                // Create the new column definition
                const newColumn = tColumnFactory(currentTColumn)

                // Insert the column at the specified index
                if (currentTColumn.index !== undefined && currentTColumn.index >= 0 && currentTColumn.index < result.length) {
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

    const getLocaleText = useCallback<GetLocaleText>(({ key, defaultValue }) =>
        t([`aggrid.${key}`, defaultValue], defaultValue) ?? defaultValue,
    [t]);

    return <div
        style={{
            height: domLayout ? undefined : (height || '75vh'),
            width: '100%',
            minWidth: 0,
            fontFamily: muiTheme.typography.fontFamily,
            // Preserve native glyph rasterization (especially for Persian) while avoiding
            // synthetic bolding from the single bundled IRANSans face.
            fontSynthesis: 'none',
        }}
        onContextMenu={(event) => {
            // Prevent the browser's default context menu, using aggrid suppressContextMenu or onContextMenu prevent default did not work!!!
            event.preventDefault();
        }}
    >
        <AgGridReact
            key={`localization-${localizationRevision}`}
            theme={resolvedAgGridTheme}
            ref={ref}
            rowData={rowData}
            columnDefs={basicColumnDefs2}
            getLocaleText={getLocaleText}
            rowHeight={48}
            enableRtl={rtl}
            domLayout={domLayout}
            autoGenerateColumnDefs={basicColumnDefs2?.length ? false : true}
            modules={AT_AG_GRID_MODULES}
            getRowId={uniqueKey ? (params) => String(params.data[uniqueKey]) : undefined}
            defaultColDef={{
                filter: true,
            }}
            onCellContextMenu={onContextMenu}
            {...restProps}
        />
        <AtAgGridContextMenu
            agEvent={contextMenu}
            onClose={onContextMenuClose}
        />
        {dialog}
    </div>
}

export default AtAgGrid;