import React, { useCallback, useRef, useContext, useEffect, useState } from 'react';

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
import ATFormContext from '../../ATFormContext/ATFormContext';
import Button from '../Button/Button';
//Styles
import StyleClasses from './ContainerWithTable.module.css';

const DEFAULT_ROW_ID_KEY = 'JSONID'
const INTERFACE_TYPES = {
    formDialog: 'formDialog',
    form: 'form',
}

const ContainerWithTableDefault = ({ _formProps_, id, value, elements, getGridColumnDefs, onChange, getRowId, label, addInterface = 'form', addButtonOrigin = 'right', showHeader = true, height = 400, actionPanelStyle, addButtonProps, resetFormAfterAdd = false, showHeaderlessTitle = false }) => {
    const { enums, rtl, localText } = useContext(ATFormContext)

    const [currentGridRef, setCurrentGridRef] = useState(null)
    const formRef = useRef(null)
    const formDataRef = useRef(null)
    const formDialogDataRef = useRef(null)
    const rowIDCounter = useRef(0)
    const [recordDialog, setRecordDialog] = useState({ show: false, editMode: false, defaultValue: null })

    const gridRefCallback = useCallback((ref) => {
        if (ref) {
            setCurrentGridRef(ref)
            ref.api.showNoRowsOverlay()
        }
    }, [])

    const formRefCallback = useCallback((ref) => {
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

            currentGridRef.api.setRowData(newValue)
        }
    }, [value, currentGridRef])

    const onInternalChange = () => {
        if (onChange && currentGridRef) {
            const gridData = []
            currentGridRef.api.forEachNode((node) => {
                const { [DEFAULT_ROW_ID_KEY]: id, ...restData } = node.data
                gridData.push({ ...restData })
            })

            onChange({ target: { value: gridData } })
        }
    }

    const onFormChange = ({ formData, formDataKeyValue, formDataSemiKeyValue }) => {
        formDataRef.current = {
            formData,
            formDataKeyValue,
            formDataSemiKeyValue
        }
    }

    const onFormDialogChange = ({ formData, formDataKeyValue, formDataSemiKeyValue }) => {
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

    const addRow = ({ formDataKeyValue }) => {
        if (currentGridRef) {
            currentGridRef.api.applyTransaction({ add: [{ [DEFAULT_ROW_ID_KEY]: getNewRowID(), ...formDataKeyValue }] });

            if (resetFormAfterAdd && formRef) {
                formRef.current.reset()
            }

            onInternalChange()
        }
    }

    const editRow = ({ data, formDataKeyValue }) => {
        if (currentGridRef) {
            currentGridRef.api.applyTransaction({ update: [{ ...data, ...formDataKeyValue }] });

            onInternalChange()
        }
    }

    const onAddClick = (event, { startLoading, stopLoading }) => {
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

    const onEditClick = (event, { data, startLoading, stopLoading }) => {
        setRecordDialog({
            show: true,
            editMode: true,
            defaultValue: data,
        })
    }

    const onRemoveClick = (event, { data, startLoading, stopLoading }) => {
        if (currentGridRef) {
            currentGridRef.api.applyTransaction({ remove: [data] });

            onInternalChange()
        }
    }

    const gridColumnDefs = getGridColumnDefs ? getGridColumnDefs(getColumnDefsByATFormElements({ formElements: elements, enums })) : getColumnDefsByATFormElements({ formElements: elements, enums })

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
            <Grid container spacing={2} sx={{ marginBottom: '5px' }}>
                {
                    recordDialog.show &&
                    <ATFormDialog
                        ref={formRefCallback}
                        onChange={onFormDialogChange}
                        onSubmitClick={() => {
                            if (recordDialog.editMode)
                                editRow({ data: recordDialog.defaultValue, formDataKeyValue: formDialogDataRef.current.formDataKeyValue })
                            else
                                addRow({ formDataKeyValue: formDialogDataRef.current.formDataKeyValue })

                            setRecordDialog({ show: false })
                        }}
                        onClose={() => setRecordDialog({ show: false })}
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
                        <Grid item md={2}>
                            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                                {label}
                            </Typography>
                        </Grid>
                        <Grid item md={8}>

                        </Grid>
                    </>
                }
                <Grid item md={2}>
                    <Button label={localText['Add']} onClick={onAddClick} {...addButtonProps || {}} />
                </Grid>
            </Grid>
            <ATAgGrid
                onGridReady={gridRefCallback}
                height={height}
                columnDefs={[
                    ...(gridColumnDefs || []),
                    ColumnDefTemplates.createEdit({ onClick: onEditClick, pinned: 'left' }),
                    ColumnDefTemplates.createRemove({ onClick: onRemoveClick, pinned: 'left' })
                ]}
                getRowId={getRowId ? getRowId() : (params) => params.data[DEFAULT_ROW_ID_KEY]}
            />
        </div>
    </div >
}

export default ContainerWithTableDefault;