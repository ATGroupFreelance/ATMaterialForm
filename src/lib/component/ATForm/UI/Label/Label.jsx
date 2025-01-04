import Typography from '@mui/material/Typography';

const Label = ({ atFormProvidedProps, id, label, ...restProps }) => {
    return <Typography {...restProps}>
        {label}
    </Typography>
}

export default Label;