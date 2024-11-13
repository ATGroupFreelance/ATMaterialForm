import { Grid } from '@mui/material';
import { useCallback, useEffect, useRef } from 'react';
import ATForm from '../../ATForm';

const Form = ({ id, value, onChange, children, elements, ...restProps }) => {
    const mRef = useRef(null)
    const refCallback = useCallback((ref) => {
        if (ref) {
            mRef.current = ref
        }
    }, [])

    useEffect(() => {
        if (mRef.current) {
            mRef.current.reset(value, true, true, true)
        }
    }, [value])


    const onInternalChange = ({ formDataSemiKeyValue }) => {
        if (onChange) {
            onChange({ target: { value: formDataSemiKeyValue } })
        }
    }

    return <Grid container spacing={2}>
        <ATForm ref={refCallback} onChange={onInternalChange} {...restProps}>
            {
                [
                    ...(children || []),
                    ...(elements || [])
                ]
            }
        </ATForm>
    </Grid>
}

export default Form;