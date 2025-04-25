import { ATFormContext } from '@/lib/component/ATForm/ATFormContext/ATFormContext';
import { useContext } from 'react';
import { ATFormContextInterface } from '@/lib/types/ATFormContext.type';

const useATForm = (): ATFormContextInterface => {
    const context = useContext(ATFormContext);

    if (context === undefined) {
        throw new Error('useATForm must be used within an <ATFormContextProvider>');
    }

    return context;
};

export default useATForm;