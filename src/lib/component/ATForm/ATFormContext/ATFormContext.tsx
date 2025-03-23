import React, { createContext, ReactNode } from 'react';
// Local text
import LocalText from './LocalText';
import { ATFormContextType } from '@/lib/types/ATFormContext';

// Create the context with a default value of undefined
const ATFormContext = createContext<ATFormContextType | undefined>(undefined);

// Define the type for the provider props
interface ATFormContextProviderProps {
  children: ReactNode;
  value: ATFormContextType;
}

// Provider component
export const ATFormContextProvider: React.FC<ATFormContextProviderProps> = ({ children, value }) => {
  const { localText, getLocalText, ...restValue } = value;

  // Merge localText with defaults
  const newLocalText: Record<string, string> = {
    ...LocalText,
    ...localText,
  };

  // Function to get localized text
  const fallbackGetLocalText = (id: string | null | undefined, fallbackLabel?: string): string | null | undefined => {
    if (!id)
      return id

    if (typeof id !== "string") 
      return id    

    return newLocalText[id] || newLocalText[id.toUpperCase()] || newLocalText[id.toLowerCase()] || fallbackLabel || id;
  };

  return (
    <ATFormContext.Provider value={{ ...restValue, localText: newLocalText, getLocalText: getLocalText || fallbackGetLocalText }}>
      {children}
    </ATFormContext.Provider>
  );
};

export default ATFormContext;