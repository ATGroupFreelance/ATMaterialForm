import { CellRendererIconButtonProps } from '@/lib/types/ATAgGrid.type';
import ATIconButton from '../../../ATForm/UI/IconButton/IconButton';

const IconButton = ({ onClick, icon, data, confirmationMessage, tooltip, getCellRendererParams }: CellRendererIconButtonProps) => {
    let cellRendererParamsProps = {}

    if (getCellRendererParams) {
        cellRendererParamsProps = getCellRendererParams(data)
    }

    return <ATIconButton
        atFormProvidedProps={undefined}
        disabled={undefined}
        children={undefined}
        onClick={(props: any) => onClick({ ...props, data })}
        icon={icon}
        confirmationMessage={confirmationMessage}
        tooltip={tooltip}
        {...cellRendererParamsProps} />
}

export default IconButton;