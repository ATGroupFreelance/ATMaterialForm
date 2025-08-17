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
import useATFormConfig from '@/lib/hooks/useATFormConfig/useATFormConfig';

const ATFormCollapseWrapper = ({ children, childProps, config }: ATFormCollapseWrapperProps) => {
    const { size = 12, label = 'Details' } = childProps.tProps;
    const { getLocalText } = useATFormConfig()

    const [open, setOpen] = useState<boolean>(config?.defaultOpen || false);
    const theme = useTheme();

    const handleToggle = () => {
        setOpen((prev: any) => !prev);
    };

    return (
        <Grid size={size}>
            <Box
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    height: '100%',
                    borderRadius: '10px',
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
                        padding: '6px'
                    }}
                >
                    <Typography variant="subtitle1" fontWeight={500}>
                        {getLocalText(label)}
                    </Typography>
                    <IconButton size="small">
                        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Box>

                <Collapse in={open}>
                    <Box p={1}>
                        {children}
                    </Box>
                </Collapse>
            </Box>
        </Grid>
    );
};

export default ATFormCollapseWrapper;