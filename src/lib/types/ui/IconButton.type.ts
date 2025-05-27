import { IconButtonProps, TooltipProps } from '@mui/material'
import { ATFormMinimalUncontrolledUIProps, ATFormOnClickType, StrictOmit } from '../Common.type';

export type ATFormIconButtonProps = ATFormMinimalUncontrolledUIProps & StrictOmit<IconButtonProps, 'id' | 'onClick' | 'loading'> & {
    onClick?: ATFormOnClickType;
    loading?: boolean;
    confirmationText?: string;
    label?: string,
    tooltip?: React.ReactNode,
    tooltipProps?: TooltipProps,
    icon?: React.ReactNode,
}