import { ATFormConfigContext } from '../../component/ATForm/ATFormConfigContext/ATFormConfigContext';
import { ATFormConfigContextGuaranteedInterface } from '../../types/ATFormConfigContext.type';
import { useContext } from 'react';

const useATFormConfig = (): ATFormConfigContextGuaranteedInterface => {
    const context = useContext(ATFormConfigContext);

    if (context === undefined) {
        throw new Error('useATFormConfig must be used within an ATFormConfigProvider');
    }

    /** Inside the ATFormConfigContext provider we are making sure the Guaranteed functions have a fallback which means they are never null or undefined*/
    return context as ATFormConfigContextGuaranteedInterface;
};

export default useATFormConfig;