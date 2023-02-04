import ATButton from "lib/component/ATForm/UI/Button/Button";

const Button = ({ data, colDef, onClick, getLocalText, disabled }) => {

    return <ATButton onClick={(event, { ...props }) => onClick(event, { ...props, data })} disabled={disabled} fullWidth={true} variant={'outlined'}>{getLocalText ? getLocalText(data) : colDef.headerName}</ATButton>
}

export default Button;