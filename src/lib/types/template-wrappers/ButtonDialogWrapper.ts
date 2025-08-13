import { ATFormWrapperRendererProps } from "../ATForm.type";
import { StrictOmit } from "../Common.type";
import { ATFormButtonProps } from "../ui/Button.type";

export type ATFormButtonDialogWrapperProps = ATFormWrapperRendererProps & StrictOmit<ATFormButtonProps, 'children'>;