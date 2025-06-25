import { Grid } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import ATForm from '../../ATForm';
import { ATFormFormProps } from '@/lib/types/ui/Form.type';
import { ATFormOnChangeInterface, ATFormRefInterface } from '@/lib/types/ATForm.type';

const Form = ({ ref, id, value, onChange, children, elements, ...restProps }: ATFormFormProps) => {
    void id;
    
    const mRef = useRef<ATFormRefInterface>(null)
    
    const refCallback = useCallback((newRef: ATFormRefInterface) => {
        if (newRef) {
            mRef.current = newRef
            
            if (typeof ref === 'function') {
                ref(newRef);
            } else if (ref && typeof ref === 'object' && 'current' in ref) {
                (ref as React.RefObject<ATFormRefInterface | null>).current = newRef;
            }
        }
    }, [ref])

    useEffect(() => {
        if (mRef.current) {
            mRef.current.reset({ inputDefaultValue: value?.FormDataSemiKeyValue })
        }
    }, [value])


    const onInternalChange = (props: ATFormOnChangeInterface) => {
        if (onChange) {
            onChange({ target: { value: props } })
        }
    }

    return <Grid container spacing={2}>
        <ATForm ref={refCallback} onChange={onInternalChange} {...restProps}>
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