// ATFormWrapperContext.tsx
import React from "react"
import { AtFormWrapperContextValueInterface } from "../../../../types/AtFormWrapperContext.type"

export const AtFormWrapperContext = React.createContext<AtFormWrapperContextValueInterface | null>(null)
