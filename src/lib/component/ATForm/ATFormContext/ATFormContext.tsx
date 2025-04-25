import React, { createContext, ReactNode } from 'react';

import { ATFormContextInterface } from '@/lib/types/ATFormContext.type';

// Create the context with a default value of undefined
export const ATFormContext = createContext<ATFormContextInterface | undefined>(undefined);

// Define the type for the provider props
interface ATFormContextProviderProps {
  children: ReactNode;
  value: ATFormContextInterface;
}

export const ATFormContextProvider: React.FC<ATFormContextProviderProps> = ({ children, value }) => {
  return (
    <ATFormContext.Provider value={value}>
      {children}
    </ATFormContext.Provider>
  );
};