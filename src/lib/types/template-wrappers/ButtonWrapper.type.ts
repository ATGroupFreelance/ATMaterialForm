import { AtFormWrapperRendererProps } from "../AtFormFieldWrapper.type";
import { StrictOmit } from "../Common.type";
import { AtFormButtonProps } from "../ui/Button.type";

export type AtFormButtonWrapperConfig = StrictOmit<AtFormButtonProps, 'children'>

export type AtFormButtonWrapperProps = AtFormWrapperRendererProps<{ config?: AtFormButtonWrapperConfig }>;