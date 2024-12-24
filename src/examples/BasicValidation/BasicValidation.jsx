import React from 'react';
import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';

const BasicValidation = ({ ref,onChange }) => {
    return (
        <ATForm ref={ref} onChange={onChange}>
            {[
                formBuilder.createTextBox({ id: 'Name', validation: { required: true } }),
            ]}
        </ATForm>
    )
}

export default BasicValidation;