import { Box, Grid, Paper } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { AtFormLayoutRendererProps } from '../../../../../types/AtFormLayout.type';
import type {
    AtFormPaperLayoutAppearance,
    AtFormPaperLayoutConfig,
} from '../../../../../types/layouts/PaperLayout.type';
import LayoutHeader from '../LayoutHeader/LayoutHeader';

const getDefaultSx = (appearance: AtFormPaperLayoutAppearance): SxProps<Theme> => {
    return {
        p: 1.75,
        backgroundImage: 'none',
        ...(appearance === 'soft' ? { bgcolor: 'action.hover' } : {}),
    };
};

const mergeSx = (defaultSx: SxProps<Theme>, sx?: SxProps<Theme>): SxProps<Theme> => {
    if (!sx) return defaultSx;

    return [
        defaultSx,
        ...(Array.isArray(sx) ? sx : [sx]),
    ] as SxProps<Theme>;
};

const PaperLayout = ({ children, config }: AtFormLayoutRendererProps<AtFormPaperLayoutConfig>) => {
    const {
        title,
        description,
        icon,
        action,
        appearance = 'soft',
        paperProps,
        headerProps,
        titleProps,
        descriptionProps,
        gridProps,
    } = config || {};

    const shouldRenderHeader = title !== undefined
        || description !== undefined
        || icon !== undefined
        || action !== undefined;
    const variant = paperProps?.variant ?? (appearance === 'outlined' ? 'outlined' : 'elevation');
    const elevation = paperProps?.elevation ?? (appearance === 'elevated' ? 1 : 0);

    return (
        <Paper
            {...paperProps}
            variant={variant}
            elevation={elevation}
            sx={mergeSx(getDefaultSx(appearance), paperProps?.sx)}
        >
            {shouldRenderHeader && (
                <Box sx={{ mb: 1.25 }}>
                    <LayoutHeader
                        title={title}
                        description={description}
                        icon={icon}
                        action={action}
                        headerProps={headerProps}
                        titleProps={titleProps}
                        descriptionProps={descriptionProps}
                    />
                </Box>
            )}

            <Grid
                {...gridProps}
                container
                spacing={gridProps?.spacing ?? 1.5}
            >
                {children}
            </Grid>
        </Paper>
    );
};

export default PaperLayout;
