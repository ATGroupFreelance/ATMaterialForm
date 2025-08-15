import { ATFormWrapperRendererProps } from "../ATFormFieldWrapper.type";
import { StrictOmit } from "../Common.type";
import { ATFormButtonProps } from "../ui/Button.type";

export type ATFormButtonWrapperProps = ATFormWrapperRendererProps & StrictOmit<ATFormButtonProps, 'children'>;