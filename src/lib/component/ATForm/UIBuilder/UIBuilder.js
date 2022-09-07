import React, { useRef } from 'react';

//Components
import ControlledUIBuilder from './ControlledUIBuilder/ControlledUIBuilder';
import UncontrolledUIBuilder from './UncontrolledUIBuilder/UncontrolledUIBuilder';
//Utils
import * as UITypeUtils from '../UITypeUtils/UITypeUtils';

const UIBuilder = ({ id, label, innerRef, type, ...restProps }) => {
    const _typeInfo_ = useRef(UITypeUtils.getTypeInfo(type))

    const newLabel = label || id

    if (_typeInfo_.current.hasOwnProperty('initialValue'))
        return <ControlledUIBuilder id={id} label={newLabel} ref={innerRef} type={type} _typeInfo_={_typeInfo_.current} {...restProps} />
    else
        return <UncontrolledUIBuilder id={id} label={newLabel} type={type} _typeInfo_={_typeInfo_.current} {...restProps} />
}

export default UIBuilder;