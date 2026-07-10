import { AtFormWrapperRendererProps } from "../AtFormFieldWrapper.type";

export interface AtFormCollapseWrapperConfig {
    defaultOpen?: boolean,
}

export type AtFormCollapseWrapperProps = AtFormWrapperRendererProps<{ config?: AtFormCollapseWrapperConfig }>;