// ATFormWrapperProvider.tsx
import React from "react"
import { AtFormWrapperContext } from "./AtFormWrapperContext"
import { AtFormWrapperContextValueInterface } from "../../../../types/AtFormWrapperContext.type"

interface AtFormWrapperProviderProps {
  children: React.ReactNode
  value: AtFormWrapperContextValueInterface
}

export const AtFormWrapperProvider: React.FC<AtFormWrapperProviderProps> = ({ children, value }) => {
  return (
    <AtFormWrapperContext.Provider value={value}>
      {children}
    </AtFormWrapperContext.Provider>
  )
}
