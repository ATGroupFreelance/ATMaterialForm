//Components
import ControlledUiBuilder from './ControlledUiBuilder/ControlledUiBuilder';
import UncontrolledUiBuilder from './UncontrolledUiBuilder/UncontrolledUiBuilder';
import { AtUiBuilderProps } from '../../../types/AtForm.type';

const UiBuilder = ({ childProps }: AtUiBuilderProps) => {    
    if (childProps.typeInfo === undefined)
        return <div>Can not find a type info for the following element : id: {childProps?.tProps?.id} type: {childProps?.tProps?.type}</div>

    if (childProps.typeInfo.isControlledUi)
        return <ControlledUiBuilder childProps={childProps} />
    else
        return <UncontrolledUiBuilder childProps={childProps} />
}

export default UiBuilder;