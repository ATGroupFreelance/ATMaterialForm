//@ts-expect-error
import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react';

//MUI
import { Grid, Typography, Box, useTheme } from '@mui/material';
//ATForm
import ATForm from '../../ATForm';
import ATFormDialog from '../../ATFormDialog';
//AgGrid
import ATAgGrid from '../../../ATAgGrid/ATAgGrid';
import { getColumnDefsByATFormChildren } from '../.././../ATAgGrid/ATAgGridUtils/ATAgGridUtils';
import { ColumnDefTemplates } from '../../../ATAgGrid/ColumnDefTemplates/ColumnDefTemplates';
//Context
import useATFormConfig from '../../../../hooks/useATFormConfig/useATFormConfig';
import Button from '../Button/Button';
//AgGrid
import { AgGridReact } from 'ag-grid-react';
import { GridApi } from "ag-grid-community";
import { ATFormContainerWithTableProps } from '@/lib/types/ui/ContainerWithTable.type';
import { ATFormOnChangeInterface, ATFormRefInterface } from '@/lib/types/ATForm.type';
import { ATFormOnClickType } from '@/lib/types/Common.type';
import useATForm from '@/lib/hooks/useATForm/useATForm';

const DEFAULT_ROW_ID_KEY = 'JSONID'
const INTERFACE_TYPES = {
    formDialog: 'formDialog',
    form: 'form',
}

type ATAgGridRef = AgGridReact<GridApi> | null

const initializeOnChangeInterface = () => {
    return {
        formData: {},
        formDataKeyValue: {},
        formDataSemiKeyValue: {},
    }
}

const ContainerWithTable = ({ value, formChildren, getGridColumnDefs, onChange, getRowId, label, addInterface = 'form', addButtonOrigin = 'right', showHeader = true, height = 400, actionPanelStyle, addButtonProps, resetFormAfterAdd = false, showHeaderlessTitle = false, disabled }: ATFormContainerWithTableProps) => {
    const { enums, rtl, localText } = useATFormConfig()
    const { getTypeInfo } = useATForm()
    const theme = useTheme()

    const [currentGridRef, setCurrentGridRef] = useState<ATAgGridRef>(null)
    const formRef = useRef<ATFormRefInterface | null>(null)
    const formDataRef = useRef<ATFormOnChangeInterface>(initializeOnChangeInterface())
    const formDialogDataRef = useRef<ATFormOnChangeInterface>(initializeOnChangeInterface())
    const rowIDCounter = useRef(0)
    const [recordDialog, setRecordDialog] = useState({ show: false, editMode: false, defaultValue: null })

    const gridRefCallback = useCallback((ref: ATAgGridRef) => {
        if (ref) {
            setCurrentGridRef(ref)
            ref.api.showNoRowsOverlay()
        }
    }, [])

    const formRefCallback = useCallback((ref: ATFormRefInterface) => {
        if (ref) {
            formRef.current = ref
        }
    }, [])

    useEffect(() => {
        if (currentGridRef && currentGridRef.api) {
            let newValue = value
            console.log('rowIDCounter newValue', newValue)

            if (value && Array.isArray(value)) {
                newValue = value.map(item => {
                    const { [DEFAULT_ROW_ID_KEY]: rowID } = item
                    return {
                        ...item,
                        [DEFAULT_ROW_ID_KEY]: rowID ? rowID : getNewRowID(),
                    }
                })
            }

            currentGridRef.api.updateGridOptions({ rowData: newValue })
        }
    }, [value, currentGridRef])

    const onInternalChange = () => {
        if (onChange && currentGridRef) {
            const gridData: Array<any> = []
            currentGridRef.api.forEachNode((node) => {
                //@ts-ignore
                const { [DEFAULT_ROW_ID_KEY]: id, ...restData } = node.data
                void id;
                gridData.push({ ...restData })
            })

            console.log('AddRowB', { gridData })

            onChange({ target: { value: gridData } })
        }
    }

    const onFormChange = ({ formData, formDataKeyValue, formDataSemiKeyValue }: ATFormOnChangeInterface) => {
        formDataRef.current.formData = formData;
        formDataRef.current.formDataKeyValue = formDataKeyValue;
        formDataRef.current.formDataSemiKeyValue = formDataSemiKeyValue
    }

    const onFormDialogChange = ({ formData, formDataKeyValue, formDataSemiKeyValue }: ATFormOnChangeInterface) => {
        formDialogDataRef.current = {
            formData,
            formDataKeyValue,
            formDataSemiKeyValue
        }
    }

    const getNewRowID = () => {
        rowIDCounter.current = rowIDCounter.current + 1
        console.log('rowIDCounter', rowIDCounter)
        return rowIDCounter.current
    }

    const addRow = ({ formDataKeyValue }: Partial<ATFormOnChangeInterface>) => {
        if (currentGridRef) {
            const newID = getNewRowID()
            console.log('rowIDCounter addRow', newID)
            const newAddOperation = [{ [DEFAULT_ROW_ID_KEY]: newID, ...formDataKeyValue }]
            //@ts-ignore
            currentGridRef.api.applyTransaction({ add: newAddOperation });

            console.log('AddRowA', { newID, newAddOperation })

            if (resetFormAfterAdd && formRef) {
                formRef.current?.reset()
            }

            onInternalChange()
        }
    }

    const editRow = ({ data, formDataKeyValue }: any) => {
        if (currentGridRef) {
            currentGridRef.api.applyTransaction({ update: [{ ...data, ...formDataKeyValue }] });

            onInternalChange()
        }
    }

    const onAddClick = () => {
        if (addInterface === INTERFACE_TYPES.formDialog) {
            setRecordDialog({
                show: true,
                editMode: false,
                defaultValue: null,
            })
        }
        else if (addInterface === INTERFACE_TYPES.form) {
            addRow({ formDataKeyValue: formDataRef.current.formDataKeyValue })
        }
        else
            console.error('Invalid interface type inside containerWithTable component, possible values: ', INTERFACE_TYPES)
    }

    const onEditClick: ATFormOnClickType<{ data?: any }> = ({ data }) => {
        console.log('onEditClick', data)
        setRecordDialog({
            show: true,
            editMode: true,
            defaultValue: data,
        })
    }

    const onRemoveClick: ATFormOnClickType<{ data?: any }> = ({ data }) => {
        console.log('onRemoveClick', data)
        if (currentGridRef) {
            currentGridRef.api.applyTransaction({ remove: [data] });

            onInternalChange()
        }
    }

    const baseGridColumnDefs = getGridColumnDefs ?
        getGridColumnDefs(getColumnDefsByATFormChildren({ formChildren, enums, getTypeInfo }))
        :
        getColumnDefsByATFormChildren({ formChildren, enums, getTypeInfo })

    const gridColumnDefs = baseGridColumnDefs?.map((item: any) => {
        if (item.cellRenderer) {
            const cellRendererParams = {
                commonEventProps: { tableAPI: { onInternalChange } }
            }

            return {
                ...item,
                cellRendererParams: {
                    ...cellRendererParams,
                    ...(item.cellRendererParams || {}),
                }
            }
        }
        else
            return item
    })

    const containerSx = useMemo(() => ({
        width: '100%',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        // dark mode: a slight white overlay so it reads like a filled TextField
        // light mode: use paper so it remains neutral
        bgcolor: theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.04)'
            : theme.palette.background.paper,
        padding: 0,
        boxSizing: 'border-box',
        transition: 'background-color 200ms ease',
        // use theme radius so component corners match your theme
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden'
    }), [theme])

    const headerWrapperSx = useMemo(() => ({
        margin: '0 auto 24px',
        // subtle border that adapts to mode
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : theme.palette.divider}`,
        // use the same theme radius for a consistent look
        borderRadius: theme.shape.borderRadius,
        // keep wrapper nearly transparent so the container fill shows through
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'transparent',
        boxShadow: 'none', // sit flush like a textfield    
        overflow: 'hidden'
    }), [theme])

    const headerBarSx = useMemo(() => {
        // choose header background only in light mode, keep transparent in dark
        const bg = theme.palette.mode === 'light' ? theme.palette.primary.main : 'transparent'
        // prefer the theme-provided contrast text for the chosen background
        const fg = theme.palette.mode === 'light'
            ? (theme.palette.primary.contrastText || theme.palette.getContrastText?.(theme.palette.primary.main))
            : theme.palette.text.primary

        return {
            height: 56,
            display: 'flex',
            alignItems: 'center',
            px: 2,
            userSelect: 'none',
            backgroundColor: bg,
            color: fg,
            // subtle divider: use a darker primary shade in light mode, or a soft white in dark mode
            borderBottom: `1px solid ${theme.palette.mode === 'light' ? theme.palette.primary.dark : 'rgba(255,255,255,0.06)'}`,
            transition: 'background-color 150ms ease, color 150ms ease'
        }
    }, [theme])

    const contentSx = useMemo(() => ({
        width: rtl ? undefined : '100%',
        p: 2,
        pt: 2,
        // inner area stays transparent so the container background shows through
        backgroundColor: 'transparent'
    }), [rtl])

    return <Box sx={containerSx}>
        {showHeader && (
            <Box sx={headerWrapperSx}>
                <Box sx={{ ...headerBarSx, textAlign: rtl ? 'right' : 'left' }}>
                    <Typography variant="h5" sx={{ ml: rtl ? 0 : 1.5, mr: rtl ? 1.5 : 0, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                        {label}
                    </Typography>
                </Box>
            </Box>
        )}

        <Box sx={contentSx}>
            <Grid container spacing={2} sx={{ mb: '5px' }}>
                {
                    recordDialog.show &&
                    //@ts-ignore
                    <ATFormDialog
                        ref={formRefCallback}
                        onChange={onFormDialogChange}
                        onSubmitClick={() => {
                            if (recordDialog.editMode)
                                editRow({ data: recordDialog.defaultValue, formDataKeyValue: formDialogDataRef.current.formDataKeyValue })
                            else
                                addRow({ formDataKeyValue: formDialogDataRef.current.formDataKeyValue })

                            setRecordDialog((prevState) => ({ ...prevState, show: false }))
                        }}
                        onClose={() => setRecordDialog((prevState) => ({ ...prevState, show: false }))}
                        defaultValue={recordDialog.defaultValue}
                    >
                        {
                            [
                                ...(formChildren || []),
                            ]
                        }
                    </ATFormDialog>
                }
                {
                    addInterface === INTERFACE_TYPES.form &&
                    <ATForm
                        ref={formRefCallback}
                        onChange={onFormChange}
                        defaultValue={recordDialog.defaultValue}
                    >
                        {
                            [
                                ...(formChildren || []),
                            ]
                        }
                    </ATForm>
                }

            </Grid>

            <Grid container sx={{ mb: '4px', justifyContent: addButtonOrigin === 'right' ? 'end' : 'start', ...(actionPanelStyle || {}) }}>
                {
                    showHeaderlessTitle
                    &&
                    <>
                        <Grid size={2}>
                            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                                {label}
                            </Typography>
                        </Grid>
                        <Grid size={8}>

                        </Grid>
                    </>
                }
                <Grid size={2}>
                    <Button label={localText['Add']} onClick={onAddClick} disabled={disabled} {...addButtonProps || {}} />
                </Grid>
            </Grid>

            <ATAgGrid
                //@ts-ignore
                onGridReady={gridRefCallback}
                height={height}
                columnDefs={[
                    ...(gridColumnDefs || []),
                    ColumnDefTemplates.createEdit({ cellRendererParams: { config: { onClick: onEditClick } }, pinned: 'left' }),
                    ColumnDefTemplates.createRemove({ cellRendererParams: { config: { onClick: onRemoveClick } }, pinned: 'left' })
                ]}
                getRowId={getRowId ? getRowId() : (params) => {
                    console.log('params', {
                        params,
                        data: params.data,
                        value: String(params.data?.[DEFAULT_ROW_ID_KEY])
                    })
                    return String(params.data[DEFAULT_ROW_ID_KEY])
                }}
            />
        </Box>
    </Box>
}

export default ContainerWithTable;