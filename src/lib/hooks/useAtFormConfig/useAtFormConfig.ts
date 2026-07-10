import { AtFormConfigContext } from '../../component/AtForm/AtFormConfigContext/AtFormConfigContext';
import { AtFormConfigContextGuaranteedInterface } from '../../types/AtFormConfigContext.type';
import { useContext } from 'react';

const useAtFormConfig = (): AtFormConfigContextGuaranteedInterface => {
    const context = useContext(AtFormConfigContext);

    if (context === undefined) {
        throw new Error('useATFormConfig must be used within an ATFormConfigProvider');
    }

    /** Inside the ATFormConfigContext provider we are making sure the Guaranteed functions have a fallback which means they are never null or undefined*/
    return context as AtFormConfigContextGuaranteedInterface;
};

export default useAtFormConfig;