import { ATFormWrapperRendererProps } from "../ATFormFieldWrapper.type";

export interface ATFormCollapseWrapperConfig {
    defaultOpen?: boolean,
}

export type ATFormCollapseWrapperProps = ATFormWrapperRendererProps<{ config?: ATFormCollapseWrapperConfig }>;