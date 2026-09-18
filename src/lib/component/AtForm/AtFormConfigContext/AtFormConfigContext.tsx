import React, { createContext, ReactNode, useCallback, useMemo, useRef } from 'react';
import type { AtLocalizeFunction } from '../../../localization';
import AtFormDefaultMessages from './AtFormDefaultMessages';
import { AtFormConfigContextInterface } from '../../../types/AtFormConfigContext.type';
import * as UiTypeUtils from '../UiTypeUtils/UiTypeUtils';
import { AtFormCustomComponentInterface } from '../../../types/UiTypeUtils.type';
import { createAtLocalizer, mergeAtMessageDefinitions } from '../../../localization';
import { AtFormMessageDefinitions } from './AtFormMessageDefinitions';

export const AtFormConfigContext = createContext<AtFormConfigContextInterface | undefined>(undefined);

interface AtFormConfigProviderProps {
  children: ReactNode;
  value: AtFormConfigContextInterface;
}

export const AtFormConfigProvider: React.FC<AtFormConfigProviderProps> = ({ children, value }) => {
  const { messages, messageDefinitions, t, customComponents } = value;
  const locale = value.locale ?? 'en-US';

  const mergedMessages = useMemo(() => ({
    ...AtFormDefaultMessages,
    ...messages,
  }), [messages]);

  const mergedDefinitions = useMemo(() => mergeAtMessageDefinitions(
    AtFormMessageDefinitions,
    messageDefinitions,
  ), [messageDefinitions]);

  const fallbackLocalizer = useMemo(() => {
    if (t)
      return null;

    return createAtLocalizer({
      locale,
      calendar: value.calendar,
      messages: mergedMessages,
      definitions: mergedDefinitions,
    });
  }, [t, locale, value.calendar, mergedMessages, mergedDefinitions]);

  const localize = t || fallbackLocalizer!.t;

  const localizationRevisionRef = useRef(value.localizationRevision ?? 0);
  const previousLocalizeRef = useRef<AtLocalizeFunction | null>(null);

  if (value.localizationRevision !== undefined) {
    localizationRevisionRef.current = value.localizationRevision;
  } else if (previousLocalizeRef.current !== null && previousLocalizeRef.current !== localize) {
    localizationRevisionRef.current += 1;
  }

  previousLocalizeRef.current = localize;

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
    t: localize,
    localizationRevision: localizationRevisionRef.current,
    enums: value.enums ?? {},
  }), [value, customComponents, getTypeInfo, locale, mergedMessages, mergedDefinitions, localize]);

  return (
    <AtFormConfigContext.Provider value={contextValue}>
      {children}
    </AtFormConfigContext.Provider>
  );
};
