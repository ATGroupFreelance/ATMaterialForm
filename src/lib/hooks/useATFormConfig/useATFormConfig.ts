import { ATFormConfigContext } from '../../component/ATForm/ATFormConfigContext/ATFormConfigContext';
import { ATFormConfigContextInterface } from '../../types/ATFormConfigContext.type';
import { useContext } from 'react';

const useATFormConfig = (): ATFormConfigContextInterface => {
    const context = useContext(ATFormConfigContext);

    if (context === undefined) {
        throw new Error('useATFormConfig must be used within an ATFormConfigProvider');
    }

    return context;
};

export default useATFormConfig;