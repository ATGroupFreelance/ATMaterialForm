import { Box, Grid } from '@mui/material';
import type { AtFormLayoutRendererProps } from '../../../../../types/AtFormLayout.type';
import type { AtFormSectionLayoutConfig } from '../../../../../types/layouts/SectionLayout.type';
import LayoutHeader from '../LayoutHeader/LayoutHeader';

const SectionLayout = ({ children, config }: AtFormLayoutRendererProps<AtFormSectionLayoutConfig>) => {
    const {
        title,
        description,
        icon,
        action,
        divider = true,
        sectionProps,
        headerProps,
        titleProps,
        descriptionProps,
        dividerProps,
        gridProps,
    } = config || {};

    const shouldRenderHeader = title !== undefined
        || description !== undefined
        || icon !== undefined
        || action !== undefined;

    return (
        <Box {...sectionProps}>
            {shouldRenderHeader && (
                <Box sx={{ mb: 1.5 }}>
                    <LayoutHeader
                        title={title}
                        description={description}
                        icon={icon}
                        action={action}
                        headerProps={headerProps}
                        titleProps={titleProps}
                        descriptionProps={descriptionProps}
                        appearance="section"
                        divider={divider}
                        dividerProps={dividerProps}
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

export default SectionLayout;
