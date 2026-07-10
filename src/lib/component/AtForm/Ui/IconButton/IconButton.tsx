import MUIIconButton from '@mui/material/IconButton';
import { Tooltip } from '@mui/material';
import AtToast from '../../../AtToast/AtToast';
import { AtFormIconButtonProps } from '../../../../types/ui/IconButton.type';
import useAtComponentLoading from '../../../../hooks/useAtComponentLoading/useAtComponentLoading';
import { AtFormOnClickProps } from '../../../../types/Common.type';

const IconButton = ({ onClick, loading: loadingProp, disabled, icon, confirmationText, children, tooltip, tooltipProps, ...restProps }: AtFormIconButtonProps) => {
    const { loading, startLoading, stopLoading } = useAtComponentLoading({ loading: loadingProp });

    const onYesClick = (props: AtFormOnClickProps) => {
        props.closeToast()

        if (onClick) {
            onClick({ ...props, startLoading, stopLoading })
        }
    }

    const internalOnClick = (event: any) => {
        if (confirmationText)
            AtToast.AreYouSure(confirmationText, { onYesClick })
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