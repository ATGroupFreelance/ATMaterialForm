import React, { useRef, useContext } from 'react';

//Components
import ControlledUIBuilder from './ControlledUIBuilder/ControlledUIBuilder';
import UncontrolledUIBuilder from './UncontrolledUIBuilder/UncontrolledUIBuilder';
//Utils
import * as UITypeUtils from '../UITypeUtils/UITypeUtils';
//Context
import ATFormContext from '../ATFormContext/ATFormContext';

const UIBuilder = ({ _formProps_, id, label, type, ...restProps }) => {
    const { customComponents } = useContext(ATFormContext)

    const _typeInfo_ = useRef(UITypeUtils.getTypeInfo(type) || (customComponents && customComponents.find(item => item.typeInfo.type === type).typeInfo))

    const { innerRef } = _formProps_

    const newLabel = label || id

    if (_typeInfo_.current.isControlledUI)
        return <ControlledUIBuilder id={id} _formProps_={_formProps_} label={newLabel} ref={innerRef} type={type} _typeInfo_={_typeInfo_.current} {...restProps} />
    else
        return <UncontrolledUIBuilder id={id} _formProps_={_formProps_} label={newLabel} type={type} _typeInfo_={_typeInfo_.current} {...restProps} />
}

export default UIBuilder;