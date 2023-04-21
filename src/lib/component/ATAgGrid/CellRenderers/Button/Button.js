import ATButton from "lib/component/ATForm/UI/Button/Button";

const Button = ({ data, getCellRendererParams, colDef, onClick, disabled, variant, color }) => {
    let props = {}

    if (getCellRendererParams) {
        props = getCellRendererParams(data)
    }

    // eslint-disable-next-line
    const { headerName, ["onClick"]: getCellRendererParamsOnClick, ...restProps } = props

    return <ATButton
        onClick={(event, { ...props }) => {
            if (onClick)
                onClick(event, { ...props, data })

            if (getCellRendererParamsOnClick)
                getCellRendererParamsOnClick(event, { ...props, data })
        }}
        disabled={disabled}
        fullWidth={true}
        variant={variant}
        color={color}
        {...(restProps || {})}
    >
        {headerName === undefined ? colDef.headerName : headerName}
    </ATButton>
}

export default Button;