import ATIconButton from '../../../ATForm/UI/IconButton/IconButton';

const IconButton = ({ onClick, icon, data, confirmationMessage }) => {
    return <ATIconButton onClick={(event, { startLoading, stopLoading }) => onClick(event, { startLoading, stopLoading, data })} icon={icon} confirmationMessage={confirmationMessage}/>
}

export default IconButton;