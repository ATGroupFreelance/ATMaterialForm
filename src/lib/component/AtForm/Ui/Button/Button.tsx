import MUIButton from '@mui/material/Button';
import AtToast from '../../../AtToast/AtToast';
import { AtFormButtonProps } from '../../../../types/ui/Button.type';
import { AtFormOnClickProps } from '../../../../types/Common.type';
import useAtComponentLoading from '../../../../hooks/useAtComponentLoading/useAtComponentLoading';
import { CircularProgress } from '@mui/material';

const Button = ({ id, label, confirmationText, fullWidth = true, onClick, color = 'primary', children, loading: loadingProp, disabled, ...restProps }: AtFormButtonProps) => {
    void id;

    const { loading, startLoading, stopLoading } = useAtComponentLoading({ loading: loadingProp })

    const onYesClick = (props: AtFormOnClickProps) => {
        props.closeToast()

        if (onClick) {
            onClick({ ...props, startLoading, stopLoading })
        }
    }

    const internalOnClick = (event: any) => {
        if (confirmationText) {
            AtToast.AreYouSure(confirmationText, { onYesClick })
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