import React, { createContext, ReactNode } from 'react';

import { AtFormContextInterface } from '../../../types/AtFormContext.type';

// Create the context with a default value of undefined
export const AtFormContext = createContext<AtFormContextInterface | undefined>(undefined);

// Define the type for the provider props
interface AtFormContextProviderProps {
  children: ReactNode;
  value: AtFormContextInterface;
}

export const AtFormContextProvider: React.FC<AtFormContextProviderProps> = ({ children, value }) => {
  return (
    <AtFormContext.Provider value={value}>
      {children}
    </AtFormContext.Provider>
  );
};