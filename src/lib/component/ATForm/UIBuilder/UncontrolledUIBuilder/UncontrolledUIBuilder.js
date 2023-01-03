import React, { Suspense, useContext } from 'react';
//Context
import ATFormContext from '../../ATFormContext/ATFormContext';

const Button = React.lazy(() => import('../../UI/Button/Button'));

const UncontrolledUIBuilder = ({ _formProps_, _typeInfo_, type, value, defaultValue, onChange, ...restProps }) => {
    const { customComponents } = useContext(ATFormContext)

    const commonProps = {
        _formProps_: _formProps_,
        ...restProps,
    }

    let CustomComponent = null
    if (customComponents) {
        const found = customComponents.find(item => item.typeInfo.type === type)
        CustomComponent = found ? found.component : null
    }

    return <Suspense fallback={<div>Loading...</div>}>
        {type === 'Button' && <Button {...commonProps} />}
        {CustomComponent && <CustomComponent {...commonProps} />}
    </Suspense>
}

export default UncontrolledUIBuilder; 