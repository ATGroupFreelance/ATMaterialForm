import React, { createContext, ReactNode, useCallback, useMemo } from 'react';
// Local text
import LocalText from './LocalText';
import { AtFormConfigContextInterface } from '../../../types/AtFormConfigContext.type';
//Utils
import * as UiTypeUtils from '../UiTypeUtils/UiTypeUtils';
import { AtFormCustomComponentInterface } from '../../../types/UiTypeUtils.type';
import { createAtLocalizer, mergeAtMessageDefinitions } from '../../../localization';
import { AtFormMessageDefinitions } from './AtFormMessageDefinitions';

// Create the context with a default value of undefined
export const AtFormConfigContext = createContext<AtFormConfigContextInterface | undefined>(undefined);

// Define the type for the provider props
interface AtFormConfigProviderProps {
  children: ReactNode;
  value: AtFormConfigContextInterface;
}

// Provider component
export const AtFormConfigProvider: React.FC<AtFormConfigProviderProps> = ({ children, value }) => {
  const { localText, messages, messageDefinitions, t, getLocalText, customComponents } = value;
  const locale = value.locale ?? 'en-US';

  // Keep the legacy dictionary available for external consumers, while compiling localization once per catalog change.
  const mergedMessages = useMemo(() => ({
    ...LocalText,
    ...localText,
    ...messages,
  }), [localText, messages]);

  const mergedDefinitions = useMemo(() => mergeAtMessageDefinitions(
    AtFormMessageDefinitions,
    messageDefinitions,
  ), [messageDefinitions]);

  const fallbackLocalizer = useMemo(() => {
    if (t || getLocalText)
      return null;

    return createAtLocalizer({
      locale,
      calendar: value.calendar,
      messages: mergedMessages,
      definitions: mergedDefinitions,
    });
  }, [t, getLocalText, locale, value.calendar, mergedMessages, mergedDefinitions]);

  const localize = t || getLocalText || fallbackLocalizer!.t;

  const getTypeInfo = useCallback((type: string) => {
    const customTypes = customComponents ? customComponents.map((item: AtFormCustomComponentInterface) => item.typeInfo) : null

    return UiTypeUtils.getTypeInfo(type, customTypes)
  }, [customComponents])

  const contextValue = useMemo(() => ({
    ...value,
    customComponents,
    getTypeInfo,
    locale,
    messages: mergedMessages,
    messageDefinitions: mergedDefinitions,
    localText: mergedMessages,
    t: localize,
    getLocalText: localize,
    enums: value.enums ?? {},
  }), [value, customComponents, getTypeInfo, locale, mergedMessages, mergedDefinitions, localize]);

  return (
    <AtFormConfigContext.Provider value={contextValue}>
      {children}
    </AtFormConfigContext.Provider>
  );
};