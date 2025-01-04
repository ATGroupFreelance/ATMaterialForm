//@ts-expect-error
import React, { useCallback, useRef, useContext, useEffect, useState } from 'react';

//MUI
import { Grid2, Typography } from '@mui/material';
//ATForm
import ATForm from '../../ATForm';
import ATFormDialog from '../../ATFormDialog';
//AgGrid
import ATAgGrid from '../../../ATAgGrid/ATAgGrid';
import { getColumnDefsByATFormElements } from '../.././../ATAgGrid/ATAgGridUtils/ATAgGridUtils';
import { ColumnDefTemplates } from '../../../ATAgGrid/ColumnDefTemplates/ColumnDefTemplates';
//Context
import ATFormContext from '../../ATFormContext/ATFormContext';
import Button from '../Button/Button';
//Styles
import StyleClasses from './ContainerWithTable.module.css';
//AgGrid
import { AgGridReact } from 'ag-grid-react';
import { GridApi } from "ag-grid-community";
import { ATContainerWithTableProps } from '@/lib/types/ContainerWithTable';
import { ATFormOnChangeInterface } from '@/lib/types/Common';
import { ATButtonOnClickHandler } from '@/lib/types/Button';

const DEFAULT_ROW_ID_KEY = 'JSONID'
const INTERFACE_TYPES = {
    formDialog: 'formDialog',
    form: 'form',
}

type ATAgGridRef = AgGridReact<GridApi> | null
type ATFormRef = ATForm | null
const initializeOnChangeInterface = () => {
    return {
        formData: {},
        formDataKeyValue: {},
        formDataSemiKeyValue: {},
    }
}

const ContainerWithTable = ({ atFormProvidedProps, value, elements, getGridColumnDefs, onChange, getRowId, label, addInterface = 'form', addButtonOrigin = 'right', showHeader = true, height = 400, actionPanelStyle, addButtonProps, resetFormAfterAdd = false, showHeaderlessTitle = false, disabled }: ATContainerWithTableProps) => {
    const { enums, rtl, localText } = useContext(ATFormContext)

    const [currentGridRef, setCurrentGridRef] = useState<ATAgGridRef>(null)
    const formRef = useRef<ATFormRef>(null)
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

    const formRefCallback = useCallback((ref: ATFormRef) => {
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
                gridData.push({ ...restData })
            })

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
        return rowIDCounter.current
    }

    const addRow = ({ formDataKeyValue }: Partial<ATFormOnChangeInterface>) => {
        if (currentGridRef) {
            //@ts-ignore
            currentGridRef.api.applyTransaction({ add: [{ [DEFAULT_ROW_ID_KEY]: getNewRowID(), ...formDataKeyValue }] });

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

    const onEditClick: ATButtonOnClickHandler<{ data?: any }> = (_event: any, { data }) => {
        setRecordDialog({
            show: true,
            editMode: true,
            defaultValue: data,
        })
    }

    const onRemoveClick: ATButtonOnClickHandler<{ data?: any }> = (_event: any, { data }) => {
        if (currentGridRef) {
            currentGridRef.api.applyTransaction({ remove: [data] });

            onInternalChange()
        }
    }

    const baseGridColumnDefs = getGridColumnDefs ? getGridColumnDefs(getColumnDefsByATFormElements({ formElements: elements, enums, getTypeInfo: atFormProvidedProps.getTypeInfo })) : getColumnDefsByATFormElements({ formElements: elements, enums, getTypeInfo: atFormProvidedProps.getTypeInfo })

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

    return <div style={{ width: '100%' }}>
        {showHeader &&
            <div className={StyleClasses.HeaderBar} style={{ textAlign: rtl ? 'right' : 'left' }}>
                <Typography variant='h5' sx={{ marginLeft: '12px', marginRight: '12px', paddingTop: '6px' }}>
                    {label}
                </Typography>
            </div>
        }
        <div className={classesArray.join(' ')} style={{ width: !rtl && showHeader ? '98%' : '100%' }}>
            <Grid2 container spacing={2} sx={{ marginBottom: '5px' }}>
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

            </Grid2>
            <Grid2 container sx={{ marginBottom: '4px', justifyContent: addButtonOrigin === 'right' ? 'end' : 'start', ...(actionPanelStyle || {}) }}>
                {
                    showHeaderlessTitle
                    &&
                    <>
                        <Grid2 size={2}>
                            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                                {label}
                            </Typography>
                        </Grid2>
                        <Grid2 size={8}>

                        </Grid2>
                    </>
                }
                <Grid2 size={2}>
                    <Button label={localText['Add']} onClick={onAddClick} disabled={disabled} {...addButtonProps || {}} />
                </Grid2>
            </Grid2>
            <ATAgGrid
                //@ts-ignore
                onGridReady={gridRefCallback}
                height={height}
                columnDefs={[
                    ...(gridColumnDefs || []),
                    ColumnDefTemplates.createEdit({ cellRendererParams: { onClick: onEditClick }, pinned: 'left' }),
                    ColumnDefTemplates.createRemove({ cellRendererParams: { onClick: onRemoveClick }, pinned: 'left' })
                ]}
                //@ts-ignore
                getRowId={getRowId ? getRowId() : (params) => String(params.data[DEFAULT_ROW_ID_KEY])}
                ref={undefined}
                rowData={undefined}
                domLayout={undefined}
                tColumns={undefined}
            />
        </div>
    </div >
}

export default ContainerWithTable;