import ATIconButton from '../../../ATForm/UI/IconButton/IconButton';

const IconButton = ({ onClick, icon, data, confirmationMessage, tooltip, getCellRendererParams }) => {
    let cellRendererParamsProps = {}

    if (getCellRendererParams) {
        cellRendererParamsProps = getCellRendererParams(data)
    }

    return <ATIconButton onClick={(event, props) => onClick(event, { ...props, data })} icon={icon} confirmationMessage={confirmationMessage} tooltip={tooltip} {...cellRendererParamsProps} />
}

export default IconButton;