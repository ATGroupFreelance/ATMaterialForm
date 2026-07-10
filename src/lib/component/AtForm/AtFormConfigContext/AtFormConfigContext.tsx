import React, { createContext, ReactNode, useCallback, useMemo } from 'react';
// Local text
import LocalText from './LocalText';
import { AtFormConfigContextInterface } from '../../../types/AtFormConfigContext.type';
//Utils
import * as UiTypeUtils from '../UiTypeUtils/UiTypeUtils';
import { AtFormCustomComponentInterface } from '../../../types/UiTypeUtils.type';

// Create the context with a default value of undefined
export const AtFormConfigContext = createContext<AtFormConfigContextInterface | undefined>(undefined);

// Define the type for the provider props
interface AtFormConfigProviderProps {
  children: ReactNode;
  value: AtFormConfigContextInterface;
}

// Provider component
export const AtFormConfigProvider: React.FC<AtFormConfigProviderProps> = ({ children, value }) => {
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
    const customTypes = customComponents ? customComponents.map((item: AtFormCustomComponentInterface) => item.typeInfo) : null

    return UiTypeUtils.getTypeInfo(type, customTypes)
  }, [customComponents])

  return (
    <AtFormConfigContext.Provider value={{ ...restValue, customComponents, getTypeInfo, localText: newLocalText, getLocalText: getLocalText || fallbackGetLocalText }}>
      {children}
    </AtFormConfigContext.Provider>
  );
};