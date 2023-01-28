import React from 'react';
import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';

const ContainerWithTable = React.forwardRef(({ onChange }, forwardRef) => {
    return (
        <ATForm ref={forwardRef} onChange={onChange} validationDisabled={true}>
            {[
                formBuilder.createContainerWithTable({ id: 'ContainerWithTable' }),
            ]}
        </ATForm>
    )
})

export default ContainerWithTable;