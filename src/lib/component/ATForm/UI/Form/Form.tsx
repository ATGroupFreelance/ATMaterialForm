import { Grid } from '@mui/material';
import ATForm from '../../ATForm';
import { ATFormFormProps } from '@/lib/types/ui/Form.type';
import { ATFormOnChangeInterface } from '@/lib/types/ATForm.type';

const Form = ({ ref, id, value, onChange, children, elements, ...restProps }: ATFormFormProps) => {
    void id;

    const onInternalChange = (props: ATFormOnChangeInterface) => {
        if (onChange) {
            onChange({ target: { value: props.formDataSemiKeyValue } })
        }
    }

    console.log('FormValue', value)

    return <Grid container spacing={2}>
        <ATForm ref={ref} value={value} valueFormat='FormDataSemiKeyValue' onChange={onInternalChange} {...restProps}>
            {
                [
                    ...(children as Array<any> || []),
                    ...(elements || [])
                ]
            }
        </ATForm>
    </Grid>
}

export default Form;