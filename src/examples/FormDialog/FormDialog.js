import React, { useState } from "react";

import { Button } from "@mui/material";
import { ATFormDialog, formBuilder } from "lib";

const FormDialog = React.forwardRef((props, forwardRef) => {
    const [dialog, setDialog] = useState(null)

    const onDialogSubmit = (event, { startLoading, stopLoading, formData, formDataKeyValue }) => {
        stopLoading()
        console.log('onDialogSubmit formDataKeyValue', formDataKeyValue)

        setTimeout(() => {
            stopLoading()
            setDialog(null)
        }, 1000)
    }

    const onOpenDialogClick = () => {
        const newDialog = <ATFormDialog ref={forwardRef} title={'Form Dialog Title'} onClose={() => setDialog(null)} onSubmitClick={onDialogSubmit} {...props}>
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
            {dialog}
        </div>
    )
})

export default FormDialog;