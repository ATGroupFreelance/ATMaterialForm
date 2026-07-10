import { AtFormContext } from '../../component/AtForm/AtFormContext/AtFormContext';
import { useContext } from 'react';
import { AtFormContextInterface } from '../../types/AtFormContext.type';

const useAtForm = (): AtFormContextInterface => {
    const context = useContext(AtFormContext);

    if (context === undefined) {
        throw new Error('useATForm must be used within an <ATFormContextProvider>');
    }

    return context;
};

export default useAtForm;