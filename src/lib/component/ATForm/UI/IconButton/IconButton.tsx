import MUIIconButton from '@mui/material/IconButton';
import { Tooltip } from '@mui/material';
import ATToast from '../../../ATToast/ATToast';
import { ATFormIconButtonProps } from '../../../../types/ui/IconButton.type';
import useATComponentLoading from '../../../../hooks/useATComponentLoading/useATComponentLoading';
import { ATFormOnClickProps } from '../../../../types/Common.type';

const IconButton = ({ onClick, loading: loadingProp, disabled, icon, confirmationText, children, tooltip, tooltipProps, ...restProps }: ATFormIconButtonProps) => {
    const { loading, startLoading, stopLoading } = useATComponentLoading({ loading: loadingProp });

    const onYesClick = (props: ATFormOnClickProps) => {
        props.closeToast()

        if (onClick) {
            onClick({ ...props, startLoading, stopLoading })
        }
    }

    const internalOnClick = (event: any) => {
        if (confirmationText)
            ATToast.AreYouSure(confirmationText, { onYesClick })
        else if (onClick)
            onClick({ event, startLoading, stopLoading })
    }

    const output = <MUIIconButton disabled={loading || disabled} onClick={internalOnClick} {...restProps}>{icon}{children}</MUIIconButton>

    return tooltip ?
        <Tooltip title={tooltip} {...tooltipProps}>
            <span>
                {output}
            </span>
        </Tooltip>
        :
        output
}

export default IconButton;