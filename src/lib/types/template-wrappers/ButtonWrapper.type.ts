import { ATFormWrapperRendererProps } from "../ATFormFieldWrapper.type";
import { StrictOmit } from "../Common.type";
import { ATFormButtonProps } from "../ui/Button.type";

export type ATFormButtonWrapperConfig = StrictOmit<ATFormButtonProps, 'children'>

export type ATFormButtonWrapperProps = ATFormWrapperRendererProps<{ config?: ATFormButtonWrapperConfig }>;