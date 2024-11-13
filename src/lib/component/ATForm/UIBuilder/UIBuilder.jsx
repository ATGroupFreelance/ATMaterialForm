import React from 'react';

//Components
import ControlledUIBuilder from './ControlledUIBuilder/ControlledUIBuilder';
import UncontrolledUIBuilder from './UncontrolledUIBuilder/UncontrolledUIBuilder';

const UIBuilder = ({ _formProps_, id, label, type, ...restProps }) => {
    const _typeInfo_ = _formProps_.getTypeInfo(type)

    const { innerRef } = _formProps_

    const newLabel = label || id

    if (_typeInfo_.isControlledUI)
        return <ControlledUIBuilder id={id} _formProps_={_formProps_} label={newLabel} ref={innerRef} type={type} _typeInfo_={_typeInfo_} {...restProps} />
    else
        return <UncontrolledUIBuilder id={id} _formProps_={_formProps_} label={newLabel} type={type} _typeInfo_={_typeInfo_} {...restProps} />
}

export default UIBuilder;