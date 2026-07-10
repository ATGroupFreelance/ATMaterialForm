import { AtFormWrapperRendererProps } from "../AtFormFieldWrapper.type";
import { StrictOmit } from "../Common.type";
import { AtFormButtonProps } from "../ui/Button.type";

export type AtFormButtonDialogWrapperConfig = {
    buttonProps: StrictOmit<AtFormButtonProps, 'children'>,
    //TODO Handle dialog props
    dialogProps: any,
}

export type AtFormButtonDialogWrapperProps = AtFormWrapperRendererProps<{ config?: AtFormButtonDialogWrapperConfig }>;