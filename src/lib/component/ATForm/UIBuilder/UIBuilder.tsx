//Components
import ControlledUIBuilder from './ControlledUIBuilder/ControlledUIBuilder';
import UncontrolledUIBuilder from './UncontrolledUIBuilder/UncontrolledUIBuilder';
import { ATUIBuilderProps } from '@/lib/types/ATForm.type';

const UIBuilder = ({ childProps }: ATUIBuilderProps) => {
    if (childProps.typeInfo.isControlled)
        return <ControlledUIBuilder childProps={childProps} />
    else
        return <UncontrolledUIBuilder childProps={childProps} />
}

export default UIBuilder;