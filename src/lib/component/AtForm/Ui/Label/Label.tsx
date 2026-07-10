import { AtFormLabelProps } from '../../../../types/ui/Label.type';
import Typography from '@mui/material/Typography';

const Label = ({ id, label, children, ...restProps }: AtFormLabelProps) => {
    void id;
    
    return <Typography {...restProps}>
        {label}
        {children}
    </Typography>
}

export default Label;