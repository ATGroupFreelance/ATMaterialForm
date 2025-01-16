import React, { useState } from "react";

import { Button } from "@mui/material";
import { ATFormDialog, formBuilder } from "@/lib";

const FormDialog = ({ ref, ...props }) => {
    const [dialog, setDialog] = useState(null)

    const onDialogSubmit = (event, { startLoading, stopLoading, formData, formDataKeyValue, formDataSemiKeyValue }) => {
        stopLoading()
        console.log('onDialogSubmit formDataKeyValue', formDataKeyValue)

        setTimeout(() => {
            stopLoading()
            setDialog(null)
        }, 1000)
    }

    const onOpenDialogClick = () => {
        const newDialog = <ATFormDialog ref={ref} title={'Form Dialog title'} onClose={() => setDialog(null)} onSubmitClick={onDialogSubmit} {...props}>
            {
                [
                    formBuilder.createTextBox({ id: 'formDialogTextBox' }),
                ]
            }
        </ATFormDialog>

        setDialog(newDialog)
    }

    const onOpenCustomizedDialogClick = () => {
        const newDialog = <ATFormDialog ref={ref} title={'Form Dialog Title'} onClose={() => setDialog(null)}  {...props}
            getActions={(oldActions) => {
                return [
                    ...oldActions,
                    {
                        id: 'reset',
                        onClick: () => alert('reset'),
                        grid: {
                            xs: 12,
                            size: 3,
                        }
                    },
                    {
                        id: 'save',
                        color: 'success',
                        onClick: (event, { formData }) => console.log('formData', formData)
                    }
                ]
            }
            }
        >
            {
                [
                    formBuilder.createTextBox({ id: 'formDialogTextBox' }),
                ]
            }
        </ATFormDialog>

        setDialog(newDialog)
    }

    return (
        <div>
            <Button onClick={onOpenDialogClick}>Open Dialog</Button>
            <Button onClick={onOpenCustomizedDialogClick}>Open Customized Dialog</Button>
            {dialog}
        </div>
    )
}

export default FormDialog;