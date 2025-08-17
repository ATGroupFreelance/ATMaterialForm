import { ATFormWrapperRendererProps } from "../ATFormFieldWrapper.type";
import { StrictOmit } from "../Common.type";
import { ATFormButtonProps } from "../ui/Button.type";

export type ATFormButtonDialogWrapperConfig = {
    buttonProps: StrictOmit<ATFormButtonProps, 'children'>,
    //TODO Handle dialog props
    dialogProps: any,
}

export type ATFormButtonDialogWrapperProps = ATFormWrapperRendererProps<{ config?: ATFormButtonDialogWrapperConfig }>;