import { ButtonProps } from '@mui/material'
import { ATFormElementProps } from './Common';

export interface ATButtonOnClickBaseProps {
    startLoading: any;
    stopLoading: any;
}

export type ATButtonOnClickProps<T = {}> = ATButtonOnClickBaseProps & T;

export type ATButtonOnClickHandler<T = {}> = (
    event: React.MouseEvent<HTMLButtonElement>,
    props: ATButtonOnClickProps<T>
) => void;

type ATButtonBaseProps = ATFormElementProps & ButtonProps;

export interface ATButtonProps extends ATButtonBaseProps {
    onClick?: (event: any, props: { startLoading: () => void, stopLoading: () => void }) => void;
    loading?: boolean;
    confirmationMessage?: string;
}