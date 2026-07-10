import { IconButtonProps, TooltipProps } from '@mui/material'
import { AtFormMinimalUncontrolledUiProps, AtFormOnClickType, StrictOmit } from '../Common.type';

export type AtFormIconButtonProps = AtFormMinimalUncontrolledUiProps & StrictOmit<IconButtonProps, 'id' | 'onClick' | 'loading'> & {
    onClick?: AtFormOnClickType;
    loading?: boolean;
    confirmationText?: string;
    label?: string,
    tooltip?: React.ReactNode,
    tooltipProps?: TooltipProps,
    icon?: React.ReactNode,
}