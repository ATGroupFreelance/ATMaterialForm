//Components
import ControlledUIBuilder from './ControlledUIBuilder/ControlledUIBuilder';
import UncontrolledUIBuilder from './UncontrolledUIBuilder/UncontrolledUIBuilder';
import { ATUIBuilderProps } from '@/lib/types/ATForm.type';

const UIBuilder = ({ childProps }: ATUIBuilderProps) => {    
    if (childProps.typeInfo === undefined)
        return <div>Can not find a type info for the following element : {childProps.tProps.id} {childProps.tProps.type}</div>

    if (childProps.typeInfo.isControlledUI)
        return <ControlledUIBuilder childProps={childProps} />
    else
        return <UncontrolledUIBuilder childProps={childProps} />
}

export default UIBuilder;