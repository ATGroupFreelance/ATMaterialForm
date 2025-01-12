import React, { Suspense } from 'react';
//Context
import useATFormProvider from '../../../../hooks/useATFormProvider/useATFormProvider';

const Button = React.lazy(() => import('../../UI/Button/Button'));
const Label = React.lazy(() => import('../../UI/Label/Label'));
const Table = React.lazy(() => import('../../UI/Table/Table'));

const UncontrolledUIBuilder = ({ atFormProvidedProps, _typeInfo_, type, value, defaultValue, onChange, ...restProps }) => {
    const { customComponents } = useATFormProvider()

    const commonProps = {
        atFormProvidedProps: atFormProvidedProps,
        ...restProps,
    }

    let CustomComponent = null
    if (customComponents) {
        const found = customComponents.find(item => item.typeInfo.type === type)
        CustomComponent = found ? found.component : null
    }

    return <Suspense fallback={<div>Loading...</div>}>
        {type === 'Button' && <Button {...commonProps} />}
        {type === 'Label' && <Label {...commonProps} />}
        {type === 'Table' && <Table {...commonProps} />}
        {CustomComponent && <CustomComponent {...commonProps} />}
    </Suspense>
}

export default UncontrolledUIBuilder; 