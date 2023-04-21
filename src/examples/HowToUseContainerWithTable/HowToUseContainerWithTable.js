import React, { useState } from 'react';

import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';
import ServiceManager from 'serviceManager/serviceManager';

const HowToUseContainerWithTable = React.forwardRef(({ onChange }, forwardedRef) => {
    const [A, setA] = useState(0)
    const [B, setB] = useState(0)    

    return (
        <ATForm ref={forwardedRef} onChange={onChange} validationDisabled={true}>
            {[
                formBuilder.createTextBox({ id: 'OutsideContainer_TextBox1', md: 12 }),
                formBuilder.createContainerWithTable({
                    id: 'ContainerWithTable',                    
                    elements: [
                        formBuilder.createTextBox({ id: 'Name' }),
                        formBuilder.createComboBox({ id: 'Countries', options: ServiceManager.getCountries }),
                        formBuilder.createTextBox({ id: 'A', onChange: (event) => setA(event.target.value) }),
                        formBuilder.createTextBox({ id: 'B', onChange: (event) => setB(event.target.value) }),
                        formBuilder.createTextBox({ id: 'C', value: A + B }),
                    ],
                }),
                formBuilder.createTextBox({ id: 'OutsideContainer_TextBox2', md: 12 }),
            ]}
        </ATForm>
    )
})

export default HowToUseContainerWithTable;