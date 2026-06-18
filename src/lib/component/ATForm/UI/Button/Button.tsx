import MUIButton from '@mui/material/Button';
import ATToast from '../../../ATToast/ATToast';
import { ATFormButtonProps } from '../../../../types/ui/Button.type';
import { ATFormOnClickProps } from '../../../../types/Common.type';
import useATComponentLoading from '../../../../hooks/useATComponentLoading/useATComponentLoading';
import { CircularProgress } from '@mui/material';

const Button = ({ id, label, confirmationText, fullWidth = true, onClick, color = 'primary', children, loading: loadingProp, disabled, ...restProps }: ATFormButtonProps) => {
    void id;

    const { loading, startLoading, stopLoading } = useATComponentLoading({ loading: loadingProp })

    const onYesClick = (props: ATFormOnClickProps) => {
        props.closeToast()

        if (onClick) {
            onClick({ ...props, startLoading, stopLoading })
        }
    }

    const internalOnClick = (event: any) => {
        if (confirmationText) {
            ATToast.AreYouSure(confirmationText, { onYesClick })
        }
        else if (onClick)
            onClick({ event, startLoading, stopLoading })
    }

    return <MUIButton
        fullWidth={fullWidth}
        disabled={loading || disabled}
        onClick={internalOnClick}
        color={color}
        {...restProps}
        startIcon={
            loading
                ? <CircularProgress size={16} color="inherit" />
                : restProps.startIcon
        }
    >
        {label}
        {children}
    </MUIButton>
}

export default Button;