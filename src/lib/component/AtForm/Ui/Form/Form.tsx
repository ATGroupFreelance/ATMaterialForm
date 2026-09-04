import { Grid } from '@mui/material';
import AtForm from '../../AtForm';
import { AtFormFormProps } from '../../../../types/ui/Form.type';
import { AtFormOnChangeInterface } from '../../../../types/AtForm.type';
import { LogLevel } from '../../AtFormLogger';

const Form = ({ ref, id, value, onChange, children, formChildren, ...restProps }: AtFormFormProps) => {
    void id;

    const onInternalChange = (props: AtFormOnChangeInterface) => {
        if (onChange) {
            onChange({ target: { value: props.formDataSemiKeyValue } })
        }
    }

    return <Grid container spacing={2}>
        <AtForm ref={ref} runtimePrefix={id} value={value} valueFormat='FormDataSemiKeyValue' onChange={onInternalChange} logLevel={LogLevel.NONE} {...restProps}>
            {
                [
                    ...(children as Array<any> || []),
                    ...(formChildren || [])
                ]
            }
        </AtForm>
    </Grid>
}

export default Form;