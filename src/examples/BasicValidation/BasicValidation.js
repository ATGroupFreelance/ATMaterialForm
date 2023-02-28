import React from 'react';
import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';

const BasicValidation = React.forwardRef(({ onChange }, forwardRef) => {
    return (
        <ATForm ref={forwardRef} onChange={onChange}>
            {[
                formBuilder.createTextBox({ id: 'Name', validation: { required: true } }),
            ]}
        </ATForm>
    )
})

export default BasicValidation;