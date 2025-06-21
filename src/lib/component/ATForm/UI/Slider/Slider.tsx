import Typography from '@mui/material/Typography';
import SliderMUI from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { ATFormSliderProps } from '@/lib/types/ui/Slider.type';

const Slider = ({ id, label, error, helperText, ...restProps }: ATFormSliderProps) => {
    void id;

    return (
        <FormControl
            sx={{ width: '100%' }}
            error={!!error}
        >
            {label && (
                <Typography
                    sx={{
                        marginBottom: '4px',
                        color: error ? 'error.main' : 'text.primary',
                    }}
                >
                    {label}
                </Typography>
            )}
            <SliderMUI
                valueLabelDisplay="on"
                {...restProps}
            />
            {helperText && (
                <FormHelperText>{helperText}</FormHelperText>
            )}
        </FormControl>
    );
};

export default Slider;
