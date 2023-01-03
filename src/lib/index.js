import ATForm, { formBuilder } from './component/ATForm/ATForm';
import { UITypes } from './component/ATForm/UITypeUtils/UITypeUtils';
import { Grid } from '@mui/material';
import ATFormContext from './component/ATForm/ATFormContext/ATFormContext';

const createCustomComponent = ({ component, type, initialValue, isControlledUI = true }) => {
    const typeInfo = {
        type
    }

    if (isControlledUI === true)
        typeInfo['initialValue'] = initialValue

    return {
        component,
        typeInfo
    }
}

export {
    ATForm,
    formBuilder,
    createCustomComponent,
    Grid,
    UITypes,
    ATFormContext
};