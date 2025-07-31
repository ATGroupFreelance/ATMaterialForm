import { ATFormButtonWrapperProps } from '@/lib/types/template-wrappers/ButtonWrapper.type';
import Button from '../../UI/Button/Button';
import { useState } from 'react';
import { ATFormOnClickType } from '@/lib/types/Common.type';
import { Grid } from '@mui/material';

const ATFormButtonWrapper = ({ children, childProps, onClick, ...restProps }: ATFormButtonWrapperProps) => {
    const { size = 12, label = "Open" } = childProps.tProps;
    const [visible, setVisible] = useState<boolean>(false)

    const onInternalClick: ATFormOnClickType = (props) => {
        setVisible((prev: boolean) => !prev)
        if (onClick)
            onClick(props)
    }

    return (
        <Grid size={size}>
            <Button onClick={onInternalClick} sx={{height: '30px'}} {...restProps}>
                {label}
                {visible && children}
            </Button>
        </Grid>
    );
};

export default ATFormButtonWrapper;