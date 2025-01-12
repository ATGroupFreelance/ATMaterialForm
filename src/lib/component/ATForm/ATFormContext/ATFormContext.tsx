import React, { createContext, ReactNode } from 'react';
// Local text
import LocalText from './LocalText';
import { ATFormContextType } from '@/lib/types/ATFormContext';

// Create the context with a default value of undefined
const ATFormContext = createContext<ATFormContextType | undefined>(undefined);

// Define the type for the provider props
interface ATFormContextProviderProps {
  children: ReactNode;
  value: Omit<ATFormContextType, 'getLocalText'>; // The provider will calculate `getLocalText`
}

// Provider component
export const ATFormContextProvider: React.FC<ATFormContextProviderProps> = ({ children, value }) => {
  const { localText, ...restValue } = value;

  // Merge localText with defaults
  const newLocalText: Record<string, string> = {
    ...LocalText,
    ...localText,
  };

  // Function to get localized text
  const getLocalText = (id: string | null | undefined, label?: string): string => {
    if (label !== undefined) return label;

    if (id === null || id === undefined) {
      console.error(`getLocalText input id parameter was undefined for id: ${id}`);
      return 'Error, Undefined ID!';
    }

    const found = newLocalText[id] || newLocalText[id.toUpperCase()] || newLocalText[id.toLowerCase()];

    return found !== undefined ? found : id;
  };

  return (
    <ATFormContext.Provider value={{ ...restValue, localText: newLocalText, getLocalText }}>
      {children}
    </ATFormContext.Provider>
  );
};

export default ATFormContext;