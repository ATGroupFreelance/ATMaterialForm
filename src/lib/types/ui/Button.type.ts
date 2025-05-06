import { ButtonProps } from '@mui/material'
import { ATFormMinimalUncontrolledUIProps, ATFormOnClickType, StrictOmit } from '../Common.type';

export type ATFormButtonProps = ATFormMinimalUncontrolledUIProps & StrictOmit<ButtonProps, 'id' | 'onClick' | 'loading'> & {
    onClick?: ATFormOnClickType;
    loading?: boolean;
    confirmationText?: string;
    label?: string,
}