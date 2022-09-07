import TextField from '@mui/material/TextField';

const TextBox = ({ _formProps_, id, ...restProps }) => {


    return <TextField fullWidth={true} {...restProps} />
}

export default TextBox;