import { Box, Grid } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { AtFormLayoutRendererProps } from '../../../../../types/AtFormLayout.type';
import type {
    AtFormBoxLayoutAppearance,
    AtFormBoxLayoutConfig,
} from '../../../../../types/layouts/BoxLayout.type';
import LayoutHeader from '../LayoutHeader/LayoutHeader';

const getDefaultSx = (appearance: AtFormBoxLayoutAppearance): SxProps<Theme> => {
    const baseSx = {
        p: 1.75,
        borderRadius: 1,
    };

    if (appearance === 'soft') {
        return {
            ...baseSx,
            bgcolor: 'action.hover',
        };
    }

    return {
        ...baseSx,
        border: 1,
        borderStyle: appearance === 'dashed' ? 'dashed' : 'solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
    };
};

const mergeSx = (defaultSx: SxProps<Theme>, sx?: SxProps<Theme>): SxProps<Theme> => {
    if (!sx) return defaultSx;

    return [
        defaultSx,
        ...(Array.isArray(sx) ? sx : [sx]),
    ] as SxProps<Theme>;
};

const BoxLayout = ({ children, config }: AtFormLayoutRendererProps<AtFormBoxLayoutConfig>) => {
    const {
        title,
        description,
        icon,
        action,
        appearance = 'dashed',
        boxProps,
        headerProps,
        titleProps,
        descriptionProps,
        gridProps,
    } = config || {};

    const shouldRenderHeader = title !== undefined
        || description !== undefined
        || icon !== undefined
        || action !== undefined;

    return (
        <Box
            {...boxProps}
            sx={mergeSx(getDefaultSx(appearance), boxProps?.sx)}
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
        </Box>
    );
};

export default BoxLayout;
