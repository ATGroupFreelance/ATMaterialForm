import ATButton from "../../../ATForm/UI/Button/Button";

const Button = ({ data, getCellRendererParams, colDef, onClick, disabled, variant, color, confirmationMessage, api, setValue, commonEventProps }) => {
    let props = {}

    if (getCellRendererParams) {
        props = getCellRendererParams(data)
    }
    
    // eslint-disable-next-line
    const { headerName, ["onClick"]: getCellRendererParamsOnClick, ...restProps } = props

    return <ATButton
        onClick={(event, { ...props }) => {
            if (onClick)
                onClick(event, { ...props, api, setValue, commonEventProps, data })

            if (getCellRendererParamsOnClick)
                getCellRendererParamsOnClick(event, { ...props, api, setValue, commonEventProps, data })
        }}
        disabled={disabled}
        fullWidth={true}
        variant={variant}
        color={color}
        confirmationMessage={confirmationMessage}
        {...(restProps || {})}
    >
        {headerName === undefined ? colDef.headerName : headerName}
    </ATButton>
}

export default Button;