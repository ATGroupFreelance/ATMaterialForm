import Typography from '@mui/material/Typography';

const Label = ({ _formProps_, id, label, ...restProps }) => {
    return <Typography {...restProps}>
        {label}
    </Typography>
}

export default Label;