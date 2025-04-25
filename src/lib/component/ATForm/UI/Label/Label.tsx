import { ATFormLabelProps } from '@/lib/types/ui/Label.type';
import Typography from '@mui/material/Typography';

const Label = ({ id, label, children, ...restProps }: ATFormLabelProps) => {
    return <Typography {...restProps}>
        {label}
        {children}
    </Typography>
}

export default Label;