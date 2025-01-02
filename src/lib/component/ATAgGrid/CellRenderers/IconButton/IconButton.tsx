import { CellRendererIconButtonProps } from '@/lib/types/ATAgGrid';
import ATIconButton from '../../../ATForm/UI/IconButton/IconButton';

const IconButton = ({ onClick, icon, data, confirmationMessage, tooltip, getCellRendererParams }: CellRendererIconButtonProps) => {
    let cellRendererParamsProps = {}

    if (getCellRendererParams) {
        cellRendererParamsProps = getCellRendererParams(data)
    }

    return <ATIconButton
        _formProps_={undefined}
        disabled={undefined}
        children={undefined}
        onClick={(event: any, props: any) => onClick(event, { ...props, data })}
        icon={icon}
        confirmationMessage={confirmationMessage}
        tooltip={tooltip}
        {...cellRendererParamsProps} />
}

export default IconButton;