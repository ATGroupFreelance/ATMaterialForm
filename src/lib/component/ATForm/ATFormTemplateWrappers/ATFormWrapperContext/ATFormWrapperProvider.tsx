// ATFormWrapperProvider.tsx
import React from "react"
import { ATFormWrapperContext } from "./ATFormWrapperContext"
import { ATFormWrapperContextValueInterface } from "@/lib/types/ATFormWrapperContext.type"

interface ATFormWrapperProviderProps {
  children: React.ReactNode
  value: ATFormWrapperContextValueInterface
}

export const ATFormWrapperProvider: React.FC<ATFormWrapperProviderProps> = ({ children, value }) => {
  return (
    <ATFormWrapperContext.Provider value={value}>
      {children}
    </ATFormWrapperContext.Provider>
  )
}
