import React from 'react';

import { ATForm, formBuilder } from "@/lib";

const ExternalComponentIntegration = ({ ref, onChange }) => {
    return (
        <ATForm onChange={onChange} ref={ref}>
            {
                [
                    formBuilder.createTextBox({ id: 'Form Text Box' }),
                    {
                        id: 'CustomComponentTextField',
                        type: 'MyTextField',
                        size: 3,
                        label: 'CustomComponentTextField'
                    }
                ]
            }
        </ATForm>
    )
}

export default ExternalComponentIntegration;