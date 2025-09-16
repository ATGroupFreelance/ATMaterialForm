import { useState } from "react";

import { Grid } from "@mui/material";
import { ATForm, ATFormDialog, formBuilder } from "@/lib";
import { ExampleComponentInterface } from "@/App";
import { ATFormOnClickProps } from "@/lib/types/Common.type";
import Button from "@/lib/component/ATForm/UI/Button/Button";

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
        <>
            <Grid size={{ xs: 12, md: 3 }}>
                <Button onClick={onOpenDialogClick}>Open Dialog</Button>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
                <Button onClick={onOpenCustomizedDialogClick}>Open Customized Dialog</Button>
            </Grid>
            <ATForm ref={ref} {...props}>
                {
                    [
                        formBuilder.createFormDialog(
                            {
                                id: 'InlineFormDialog',
                            },
                            {
                                formChildren: [
                                    formBuilder.createTextBox({ id: "Name" })
                                ]
                            }
                        ),
                    ]
                }
            </ATForm>
            {dialog}
        </>
    )
}

export default FormDialog;