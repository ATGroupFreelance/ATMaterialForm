import React from 'react';

//Components
import ControlledUIBuilder from './ControlledUIBuilder/ControlledUIBuilder';
import UncontrolledUIBuilder from './UncontrolledUIBuilder/UncontrolledUIBuilder';

const UIBuilder = ({ atFormProvidedProps, id, label, type, ...restProps }) => {
    const _typeInfo_ = atFormProvidedProps.getTypeInfo(type)

    const { innerRef } = atFormProvidedProps

    const newLabel = label || id

    if (_typeInfo_.isControlledUI)
        return <ControlledUIBuilder id={id} atFormProvidedProps={atFormProvidedProps} label={newLabel} ref={innerRef} type={type} _typeInfo_={_typeInfo_} {...restProps} />
    else
        return <UncontrolledUIBuilder id={id} atFormProvidedProps={atFormProvidedProps} label={newLabel} type={type} _typeInfo_={_typeInfo_} {...restProps} />
}

export default UIBuilder;