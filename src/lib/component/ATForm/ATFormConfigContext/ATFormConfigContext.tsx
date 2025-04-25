import React, { createContext, ReactNode, useCallback, useMemo } from 'react';
// Local text
import LocalText from './LocalText';
import { ATFormConfigContextInterface } from '@/lib/types/ATFormConfigContext.type';
//Utils
import * as UITypeUtils from '../UITypeUtils/UITypeUtils';
import { ATFormCustomComponentInterface } from '@/lib/types/UITypeUtils.type';

// Create the context with a default value of undefined
export const ATFormConfigContext = createContext<ATFormConfigContextInterface | undefined>(undefined);

// Define the type for the provider props
interface ATFormConfigProviderProps {
  children: ReactNode;
  value: ATFormConfigContextInterface;
}

// Provider component
export const ATFormConfigProvider: React.FC<ATFormConfigProviderProps> = ({ children, value }) => {
  const { localText, getLocalText, customComponents, ...restValue } = value;

  // Merge localText with defaults
  const newLocalText: Record<string, string> = useMemo(() => {
    return {
      ...LocalText,
      ...localText,
    }
  }, [localText]);

  // Function to get localized text
  const fallbackGetLocalText = useCallback((id: string | null | undefined, fallbackLabel?: string): string | null | undefined => {
    if (!id)
      return id

    if (typeof id !== "string")
      return id

    return newLocalText[id] || newLocalText[id.toUpperCase()] || newLocalText[id.toLowerCase()] || fallbackLabel || id;
  }, [newLocalText]);

  const getTypeInfo = useCallback((type: string) => {
    const customTypes = customComponents ? customComponents.map((item: ATFormCustomComponentInterface) => item.typeInfo) : null

    return UITypeUtils.getTypeInfo(type, customTypes)
  }, [customComponents])

  return (
    <ATFormConfigContext.Provider value={{ ...restValue, customComponents, getTypeInfo, localText: newLocalText, getLocalText: getLocalText || fallbackGetLocalText }}>
      {children}
    </ATFormConfigContext.Provider>
  );
};