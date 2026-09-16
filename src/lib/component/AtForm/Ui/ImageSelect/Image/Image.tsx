import { alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import type { AtFormImageSelectImageProps } from '../../../../../types/ui/ImageSelect.type';

const Image = ({ archiveId, fileName, src, onClick, width, height, selected }: AtFormImageSelectImageProps) => {
    return (
        <Button
            sx={(theme) => ({
                display: 'inline-block',
                textAlign: '-webkit-center',
                width: `${width + 18}px`,
                height: `${height + 18}px`,
                p: '3px',
                textTransform: 'none',
                border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                borderRadius: 2,
                backgroundColor: selected ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.08) : 'transparent',
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.14 : 0.06),
                },
            })}
            onClick={onClick}
            variant="text"
            color={selected ? 'secondary' : 'primary'}
        >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Box component="img" alt={fileName || archiveId} src={src} sx={{ borderRadius: 1, width: `${width}px`, height: `${height}px`, objectFit: 'cover' }} />
            </div>
        </Button>
    );
};

export default Image;
