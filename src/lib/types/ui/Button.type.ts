import { ButtonProps } from '@mui/material'
import { AtFormMinimalUncontrolledUiProps, AtFormOnClickType, StrictOmit } from '../Common.type';

export type AtFormButtonProps = AtFormMinimalUncontrolledUiProps & StrictOmit<ButtonProps, 'id' | 'onClick' | 'loading'> & {
    onClick?: AtFormOnClickType;
    loading?: boolean;
    confirmationText?: string | null;
    label?: string,
}