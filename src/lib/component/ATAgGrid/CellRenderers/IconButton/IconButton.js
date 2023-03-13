import ATIconButton from '../../../ATForm/UI/IconButton/IconButton';

const IconButton = ({ onClick, icon, data, confirmationMessage }) => {
    return <ATIconButton onClick={(event, props) => onClick(event, { ...props, data })} icon={icon} confirmationMessage={confirmationMessage} />
}

export default IconButton;