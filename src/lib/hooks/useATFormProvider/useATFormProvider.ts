import ATFormContext from '../../component/ATForm/ATFormContext/ATFormContext';
import { ATFormContextType } from '../../types/ATFormContext';
import { useContext } from 'react';

export const useATFormProvider = (): ATFormContextType => {
    const context = useContext(ATFormContext);

    if (context === undefined) {
        throw new Error('useATFormProvider must be used within an ATFormContextProvider');
    }

    return context;
};

export default useATFormProvider;