// ATFormWrapperContext.tsx
import React from "react"
import { ATFormWrapperContextValueInterface } from "@/lib/types/ATFormWrapperContext.type"

export const ATFormWrapperContext = React.createContext<ATFormWrapperContextValueInterface | null>(null)
