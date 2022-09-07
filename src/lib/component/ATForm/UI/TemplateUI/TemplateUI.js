import TextField from '@mui/material/TextField';

const TemplateUI = ({ label, value, onChange }) => {

    return <TextField fullWidth={true} onChange={onChange} value={value} label={label} />
}

export default TemplateUI;