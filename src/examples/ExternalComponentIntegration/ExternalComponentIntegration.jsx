import React from 'react';

import { ATForm, formBuilder } from "@/lib";

const ExternalComponentIntegration = React.forwardRef(({ onChange }, forwardRef) => {
    return (
        <ATForm onChange={onChange} ref={forwardRef}>
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
})

export default ExternalComponentIntegration;