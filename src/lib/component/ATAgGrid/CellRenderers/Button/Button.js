import ATButton from "lib/component/ATForm/UI/Button/Button";

const Button = ({ data, colDef, onClick, getLocalText, disabled, variant = 'outlined' }) => {

    return <ATButton onClick={(event, { ...props }) => onClick(event, { ...props, data })} disabled={disabled} fullWidth={true} variant={variant}>{getLocalText ? getLocalText(data) : colDef.headerName}</ATButton>
}

export default Button;