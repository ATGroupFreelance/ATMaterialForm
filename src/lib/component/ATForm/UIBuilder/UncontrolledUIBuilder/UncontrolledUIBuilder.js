import React, { Suspense } from 'react';

const Button = React.lazy(() => import('../../UI/Button/Button'));

const UncontrolledUIBuilder = ({ _formProps_, _typeInfo_, type, value, defaultValue, onChange, ...restProps }) => {
    const commonProps = {
        _formProps_: _formProps_,
        ...restProps,
    }

    return <Suspense fallback={<div>Loading...</div>}>
        {type === 'Button' && <Button {...commonProps} />}
    </Suspense>
}

export default UncontrolledUIBuilder; 