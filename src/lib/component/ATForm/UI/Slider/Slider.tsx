import Typography from '@mui/material/Typography';
import SliderMUI from '@mui/material/Slider';
import { ATFormSliderProps } from '@/lib/types/ui/Slider.type';

const Slider = ({ id, label, error, helperText, ...restProps }: ATFormSliderProps) => {
    return <div style={{ width: '100%' }}>
        {
            label &&
            <Typography>
                {label}
            </Typography>
        }
        <SliderMUI
            valueLabelDisplay="on"
            {...restProps}
        />
    </div>
}

export default Slider;