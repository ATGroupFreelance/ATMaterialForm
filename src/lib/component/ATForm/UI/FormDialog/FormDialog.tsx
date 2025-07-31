import { Grid } from '@mui/material';
import ATFormDialog from '../../ATFormDialog';
import { ATFormOnChangeInterface } from '@/lib/types/ATForm.type';
import { ATFormFormDialogProps } from '@/lib/types/ui/FormDialog.type';

const FormDialog = ({ ref, id, value, onChange, children, elements, ...restProps }: ATFormFormDialogProps) => {
    void id;

    const onInternalChange = (props: ATFormOnChangeInterface) => {
        if (onChange) {
            onChange({ target: { value: props.formDataSemiKeyValue } })
        }
    }
    
    return <Grid container spacing={2}>
        <ATFormDialog ref={ref} value={value} valueFormat='FormDataSemiKeyValue' onChange={onInternalChange} {...restProps}>
            {
                [
                    ...(children as Array<any> || []),
                    ...(elements || [])
                ]
            }
        </ATFormDialog>
    </Grid>
}

export default FormDialog;