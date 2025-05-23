//@ts-expect-error
import React, { useCallback, useRef, useEffect, useState } from 'react';

//MUI
import { Grid, Typography } from '@mui/material';
//ATForm
import ATForm from '../../ATForm';
import ATFormDialog from '../../ATFormDialog';
//AgGrid
import ATAgGrid from '../../../ATAgGrid/ATAgGrid';
import { getColumnDefsByATFormElements } from '../.././../ATAgGrid/ATAgGridUtils/ATAgGridUtils';
import { ColumnDefTemplates } from '../../../ATAgGrid/ColumnDefTemplates/ColumnDefTemplates';
//Context
import useATFormConfig from '../../../../hooks/useATFormConfig/useATFormConfig';
import Button from '../Button/Button';
//Styles
import StyleClasses from './ContainerWithTable.module.css';
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

const ContainerWithTable = ({ value, elements, getGridColumnDefs, onChange, getRowId, label, addInterface = 'form', addButtonOrigin = 'right', showHeader = true, height = 400, actionPanelStyle, addButtonProps, resetFormAfterAdd = false, showHeaderlessTitle = false, disabled }: ATFormContainerWithTableProps) => {
    const { enums, rtl, localText } = useATFormConfig()
    const { getTypeInfo } = useATForm()

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
        getGridColumnDefs(getColumnDefsByATFormElements({ formElements: elements, enums, getTypeInfo }))
        :
        getColumnDefsByATFormElements({ formElements: elements, enums, getTypeInfo })

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

    const classesArray = [
        StyleClasses.Default
    ]

    if (showHeader) {
        classesArray.push(StyleClasses.Header)
    }

    return <div className={StyleClasses.Default}>
        {showHeader && (
            <div className={StyleClasses.Header}>
                <div
                    className={StyleClasses.HeaderBar}
                    style={{ textAlign: rtl ? 'right' : 'left' }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            marginLeft: rtl ? '0' : '12px',
                            marginRight: rtl ? '12px' : '0',
                            paddingTop: '6px'
                        }}
                    >
                        {label}
                    </Typography>
                </div>
            </div>
        )}

        <div className={classesArray.join(' ')} style={{ width: !rtl ? '100%' : undefined, padding: '20px', paddingTop: '20px' }}>
            <Grid container spacing={2} sx={{ marginBottom: '5px' }}>
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
                                ...(elements || []),
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
                                ...(elements || []),
                            ]
                        }
                    </ATForm>
                }

            </Grid>
            <Grid container sx={{ marginBottom: '4px', justifyContent: addButtonOrigin === 'right' ? 'end' : 'start', ...(actionPanelStyle || {}) }}>
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
                    ColumnDefTemplates.createEdit({ cellRendererParams: { onClick: onEditClick }, pinned: 'left' }),
                    ColumnDefTemplates.createRemove({ cellRendererParams: { onClick: onRemoveClick }, pinned: 'left' })
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
        </div>
    </div >
}

export default ContainerWithTable;