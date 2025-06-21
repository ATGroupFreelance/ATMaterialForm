import { useState } from "react";

import { Button } from "@mui/material";
import { ATFormDialog, formBuilder } from "@/lib";
import { ExampleComponentInterface } from "@/App";
import { ATFormOnClickProps } from "@/lib/types/Common.type";

const FormDialog = ({ ref, ...props }: ExampleComponentInterface) => {
    const [dialog, setDialog] = useState<any>(null)

    const onDialogSubmit = ({ stopLoading, formDataKeyValue }: ATFormOnClickProps) => {
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
            getActions={(oldActions: any) => {
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
                        onClick: ({ formData }: ATFormOnClickProps) => console.log('formData', formData)
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