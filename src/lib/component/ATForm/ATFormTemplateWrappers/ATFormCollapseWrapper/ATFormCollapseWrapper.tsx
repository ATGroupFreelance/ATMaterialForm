import {
    Collapse,
    Grid,
    Box,
    Typography,
    IconButton,
    useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from 'react';
import { ATFormCollapseWrapperProps } from '@/lib/types/template-wrappers/CollapseWrapper.type';

const ATFormCollapseWrapper = (props: ATFormCollapseWrapperProps) => {
    const { children, childProps } = props;
    const { size = 12, label = 'Details' } = childProps.tProps;

    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const handleToggle = () => {
        setOpen((prev: any) => !prev);
    };

    return (
        <Grid size={size}>
            <Box
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    padding: 2,
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    onClick={handleToggle}
                    sx={{
                        cursor: 'pointer',
                        userSelect: 'none',
                        mb: 1,
                    }}
                >
                    <Typography variant="subtitle1" fontWeight={500}>
                        {label}
                    </Typography>
                    <IconButton size="small">
                        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Box>

                <Collapse in={open}>
                    <Box pt={1}>
                        {children}
                    </Box>
                </Collapse>
            </Box>
        </Grid>
    );
};

export default ATFormCollapseWrapper;