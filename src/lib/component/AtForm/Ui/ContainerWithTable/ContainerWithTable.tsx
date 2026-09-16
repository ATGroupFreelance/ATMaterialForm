//@ts-expect-error
import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react';

//MUI
import { Grid, Typography, Box, useTheme } from '@mui/material';
//ATForm
import AtForm from '../../AtForm';
import AtFormDialog from '../../AtFormDialog';
//AgGrid
import AtAgGrid from '../../../AtAgGrid/AtAgGrid';
import { getColumnDefsByAtFormChildren } from '../../../AtAgGrid/AtAgGridUtils/AtAgGridUtils';
import { ColumnDefTemplates } from '../../../AtAgGrid/ColumnDefTemplates/ColumnDefTemplates';
//Context
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';
import Button from '../Button/Button';
//AgGrid
import { AgGridReact } from 'ag-grid-react';
import { GridApi } from "ag-grid-community";
import { AtFormContainerWithTableProps } from '../../../../types/ui/ContainerWithTable.type';
import { AtFormOnChangeInterface, AtFormRefInterface } from '../../../../types/AtForm.type';
import { AtFormOnClickType } from '../../../../types/Common.type';
import useAtForm from '../../../../hooks/useAtForm/useAtForm';

const DEFAULT_ROW_ID_KEY = 'JSONID'
const INTERFACE_TYPES = {
    formDialog: 'formDialog',
    form: 'form',
}

type AtAgGridRef = AgGridReact<GridApi> | null

const initializeOnChangeInterface = () => {
    return {
        formData: {},
        formDataKeyValue: {},
        formDataSemiKeyValue: {},
    }
}

const ContainerWithTable = ({ id, value, formChildren, getGridColumnDefs, onChange, getRowId, label, addInterface = 'form', addButtonOrigin = 'right', showHeader = true, height = 400, actionPanelStyle, addButtonProps, resetFormAfterAdd = false, showHeaderlessTitle = false, disabled }: AtFormContainerWithTableProps) => {
    const { enums, rtl, t } = useAtFormConfig()
    const { getTypeInfo } = useAtForm()
    const theme = useTheme()

    const [currentGridRef, setCurrentGridRef] = useState<AtAgGridRef>(null)
    const formRef = useRef<AtFormRefInterface | null>(null)
    const formDialogRef = useRef<AtFormRefInterface | null>(null)
    const formDataRef = useRef<AtFormOnChangeInterface>(initializeOnChangeInterface())
    const formDialogDataRef = useRef<AtFormOnChangeInterface>(initializeOnChangeInterface())
    const rowIdCounter = useRef(0)
    const [recordDialog, setRecordDialog] = useState({ show: false, editMode: false, defaultValue: null })

    const gridRefCallback = useCallback((ref: AtAgGridRef) => {
        if (ref) {
            setCurrentGridRef(ref)
            ref.api.showNoRowsOverlay()
        }
    }, [])

    useEffect(() => {
        if (currentGridRef && currentGridRef.api) {
            let newValue = value
            console.log('rowIDCounter newValue', newValue)

            if (value && Array.isArray(value)) {
                newValue = value.map(item => {
                    const { [DEFAULT_ROW_ID_KEY]: rowId } = item
                    return {
                        ...item,
                        [DEFAULT_ROW_ID_KEY]: rowId ? rowId : getNewRowId(),
                    }
                })
            }

            currentGridRef.api.updateGridOptions({ rowData: newValue })
        }
    }, [value, currentGridRef])

    const onInternalChange = useCallback(() => {
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
    }, [currentGridRef, onChange])

    const onFormChange = ({ formData, formDataKeyValue, formDataSemiKeyValue }: AtFormOnChangeInterface) => {
        formDataRef.current.formData = formData;
        formDataRef.current.formDataKeyValue = formDataKeyValue;
        formDataRef.current.formDataSemiKeyValue = formDataSemiKeyValue
    }

    const onFormDialogChange = ({ formData, formDataKeyValue, formDataSemiKeyValue }: AtFormOnChangeInterface) => {
        formDialogDataRef.current = {
            formData,
            formDataKeyValue,
            formDataSemiKeyValue
        }
    }

    const getNewRowId = () => {
        rowIdCounter.current = rowIdCounter.current + 1
        console.log('rowIDCounter', rowIdCounter)
        return rowIdCounter.current
    }

    const addRow = ({ formDataKeyValue }: Partial<AtFormOnChangeInterface>, sourceForm: AtFormRefInterface | null) => {
        if (currentGridRef) {
            const newId = getNewRowId()
            console.log('rowIDCounter addRow', newId)
            const newAddOperation = [{ [DEFAULT_ROW_ID_KEY]: newId, ...formDataKeyValue }]
            //@ts-ignore
            currentGridRef.api.applyTransaction({ add: newAddOperation });

            console.log('AddRowA', { newId, newAddOperation })

            if (resetFormAfterAdd) {
                sourceForm?.reset()
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

    // Programmatic field updates may intentionally suppress the nested form's
    // onChange callback. Commit rows from the form ref so Add/Edit always sees
    // the authoritative current values; keep the callback snapshot as fallback.
    const getCurrentFormData = (sourceForm: AtFormRefInterface | null, fallback: AtFormOnChangeInterface) => {
        return sourceForm?.getFormData() ?? fallback
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
            addRow(getCurrentFormData(formRef.current, formDataRef.current), formRef.current)
        }
        else
            console.error('Invalid interface type inside containerWithTable component, possible values: ', INTERFACE_TYPES)
    }

    const onEditClick: AtFormOnClickType<{ data?: any }> = useCallback(({ data }) => {
        console.log('onEditClick', data)
        setRecordDialog({
            show: true,
            editMode: true,
            defaultValue: data,
        })
    }, [])

    const onRemoveClick: AtFormOnClickType<{ data?: any }> = useCallback(({ data }) => {
        console.log('onRemoveClick', data)
        if (currentGridRef) {
            currentGridRef.api.applyTransaction({ remove: [data] });
            onInternalChange()
        }
    }, [currentGridRef, onInternalChange])

    const baseGridColumnDefs = useMemo(() => {
        const generated = getColumnDefsByAtFormChildren({ formChildren, enums, getTypeInfo });
        return getGridColumnDefs ? getGridColumnDefs(generated) : generated;
    }, [enums, formChildren, getGridColumnDefs, getTypeInfo]);

    const gridColumnDefs = useMemo(() => baseGridColumnDefs?.map((item: any) => {
        if (item.cellRenderer) {
            const cellRendererParams = {
                commonEventProps: { tableApi: { onInternalChange } }
            }

            return {
                ...item,
                cellRendererParams: {
                    ...cellRendererParams,
                    ...(item.cellRendererParams || {}),
                }
            }
        }
        return item;
    }), [baseGridColumnDefs, onInternalChange]);

    const finalGridColumnDefs = useMemo(() => ([
        ...(gridColumnDefs || []),
        ColumnDefTemplates.createEdit({ cellRendererParams: { config: { onClick: onEditClick } }, pinned: 'left' }),
        ColumnDefTemplates.createRemove({ cellRendererParams: { config: { onClick: onRemoveClick } }, pinned: 'left' }),
    ]), [gridColumnDefs, onEditClick, onRemoveClick]);

    const containerSx = useMemo(() => ({
        width: '100%',
        minWidth: 0,
        fontFamily: theme.typography.fontFamily,
        bgcolor: theme.palette.background.paper,
        padding: 0,
        boxSizing: 'border-box' as const,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        transition: theme.transitions.create(['background-color', 'border-color'], {
            duration: theme.transitions.duration.shorter,
        }),
    }), [theme])

    const headerWrapperSx = useMemo(() => ({
        margin: 0,
        border: 0,
        borderRadius: 0,
        backgroundColor: 'transparent',
        boxShadow: 'none',
        overflow: 'hidden',
    }), [])

    const headerBarSx = useMemo(() => ({
        minHeight: 48,
        display: 'flex',
        alignItems: 'center',
        px: 1.5,
        userSelect: 'none' as const,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create(['background-color', 'color'], {
            duration: theme.transitions.duration.shorter,
        }),
    }), [theme])

    const contentSx = useMemo(() => ({
        width: rtl ? undefined : '100%',
        minWidth: 0,
        p: 1.5,
        backgroundColor: theme.palette.background.paper,
    }), [rtl, theme.palette.background.paper])

    return <Box sx={containerSx}>
        {showHeader && (
            <Box sx={headerWrapperSx}>
                <Box sx={{ ...headerBarSx, textAlign: rtl ? 'right' : 'left' }}>
                    <Typography variant="subtitle1" sx={{ ml: rtl ? 0 : 0.5, mr: rtl ? 0.5 : 0, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
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
                    <AtFormDialog
                        ref={formDialogRef}
                        runtimePrefix={id}
                        onChange={onFormDialogChange}
                        onSubmitClick={() => {
                            const currentFormData = getCurrentFormData(formDialogRef.current, formDialogDataRef.current)

                            if (recordDialog.editMode)
                                editRow({ data: recordDialog.defaultValue, formDataKeyValue: currentFormData.formDataKeyValue })
                            else
                                addRow(currentFormData, formDialogRef.current)

                            setRecordDialog((prevState) => ({ ...prevState, show: false }))
                        }}
                        onClose={() => setRecordDialog((prevState) => ({ ...prevState, show: false }))}
                        defaultValue={recordDialog.defaultValue}
                        defaultValueFormat="FormDataKeyValue"
                    >
                        {
                            [
                                ...(formChildren || []),
                            ]
                        }
                    </AtFormDialog>
                }
                {
                    addInterface === INTERFACE_TYPES.form &&
                    <AtForm
                        ref={formRef}
                        runtimePrefix={id}
                        onChange={onFormChange}
                    >
                        {
                            [
                                ...(formChildren || []),
                            ]
                        }
                    </AtForm>
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
                    <Button label={t('Add') ?? 'Add'} onClick={onAddClick} disabled={disabled} {...addButtonProps || {}} />
                </Grid>
            </Grid>

            <AtAgGrid
                //@ts-ignore
                onGridReady={gridRefCallback}
                height={height}
                columnDefs={finalGridColumnDefs}
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