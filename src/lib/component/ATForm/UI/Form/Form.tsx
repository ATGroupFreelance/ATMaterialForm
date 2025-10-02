import { Grid } from '@mui/material';
import ATForm from '../../ATForm';
import { ATFormFormProps } from '@/lib/types/ui/Form.type';
import { ATFormOnChangeInterface } from '@/lib/types/ATForm.type';
import { LogLevel } from '../../ATFormLogger';

const Form = ({ ref, id, value, onChange, children, formChildren, ...restProps }: ATFormFormProps) => {
    void id;

    const onInternalChange = (props: ATFormOnChangeInterface) => {
        if (onChange) {
            onChange({ target: { value: props.formDataSemiKeyValue } })
        }
    }

    return <Grid container spacing={2}>
        <ATForm ref={ref} value={value} valueFormat='FormDataSemiKeyValue' onChange={onInternalChange} logLevel={LogLevel.NONE} {...restProps}>
            {
                [
                    ...(children as Array<any> || []),
                    ...(formChildren || [])
                ]
            }
        </ATForm>
    </Grid>
}

export default Form;