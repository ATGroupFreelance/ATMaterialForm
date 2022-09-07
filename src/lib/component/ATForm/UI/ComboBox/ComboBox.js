import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

//Facts about autocomplete:
//If "multiple" is false, value/initvalue must be string or null, if initvalue is set to "" it throws a warning that no match was found
//If "multiple" is true,  value/initvalue must be an array
//If "multiple" is false the out of onChange is an string
//if "multiple" is true the output of onChange is an array
//Option can be like this: 
//['uk', 'us']
//[{label: 'uk'}, {label: 'us'}]
const ComboBox = ({ _formProps_, label, options, onChange, autoComplete = 'disabled', error, helperText, ...restProps }) => {

    const onInternalChange = (event, newValue) => {
        if (onChange)
            onChange({ target: { value: newValue } })
    }

    return <Autocomplete
        disablePortal
        fullWidth={true}
        options={options || []}
        onChange={onInternalChange}
        isOptionEqualToValue={(option, value) => option.value === value.value}        
        renderInput={(params) => <TextField {...params} error={error} helperText={helperText} label={label} inputProps={{ ...params.inputProps, autoComplete: autoComplete }} />}
        {...restProps}
    />
}

export default ComboBox;