import { Grid } from '@mui/material';
import type React from 'react';
import type {
    AtFormLayoutDefInterface,
    AtFormLayoutRendererProps,
} from '../../../../types/AtFormLayout.type';
import CardLayout from '../LayoutRenderers/CardLayout/CardLayout';
import BoxLayout from '../LayoutRenderers/BoxLayout/BoxLayout';
import SectionLayout from '../LayoutRenderers/SectionLayout/SectionLayout';
import PaperLayout from '../LayoutRenderers/PaperLayout/PaperLayout';
import type { AtFormCardLayoutConfig } from '../../../../types/layouts/CardLayout.type';
import type { AtFormBoxLayoutConfig } from '../../../../types/layouts/BoxLayout.type';
import type { AtFormSectionLayoutConfig } from '../../../../types/layouts/SectionLayout.type';
import type { AtFormPaperLayoutConfig } from '../../../../types/layouts/PaperLayout.type';

interface AtFormLayoutRendererResolverProps {
    layout: AtFormLayoutDefInterface,
    children: React.ReactNode,
    hidden?: boolean,
}

const AtFormLayoutRendererResolver = ({ layout, children, hidden }: AtFormLayoutRendererResolverProps) => {
    const baseSize = layout.size;
    const normalizedSize = baseSize
        ? typeof baseSize === 'object'
            ? baseSize
            : { md: baseSize, xs: 12 }
        : null;
    const size = normalizedSize || 12;

    const rendererProps = {
        id: layout.id,
        size: layout.size,
    };

    let renderedLayout: React.ReactNode;

    if (layout.renderer === 'Card') {
        renderedLayout = (
            <CardLayout {...rendererProps} config={layout.config as AtFormCardLayoutConfig}>
                {children}
            </CardLayout>
        );
    }
    else if (layout.renderer === 'Box') {
        renderedLayout = (
            <BoxLayout {...rendererProps} config={layout.config as AtFormBoxLayoutConfig}>
                {children}
            </BoxLayout>
        );
    }
    else if (layout.renderer === 'Section') {
        renderedLayout = (
            <SectionLayout {...rendererProps} config={layout.config as AtFormSectionLayoutConfig}>
                {children}
            </SectionLayout>
        );
    }
    else if (layout.renderer === 'Paper') {
        renderedLayout = (
            <PaperLayout {...rendererProps} config={layout.config as AtFormPaperLayoutConfig}>
                {children}
            </PaperLayout>
        );
    }
    else if (typeof layout.renderer === 'function') {
        const CustomLayout = layout.renderer as React.ComponentType<AtFormLayoutRendererProps<any>>;
        renderedLayout = (
            <CustomLayout {...rendererProps} config={layout.config}>
                {children}
            </CustomLayout>
        );
    }
    else {
        console.warn('AtForm layout renderer is invalid; rendering layout children with a neutral Grid fallback.', {
            id: layout.id,
            renderer: layout.renderer,
        });
        renderedLayout = (
            <Grid container spacing={2}>
                {children}
            </Grid>
        );
    }

    return (
        <Grid
            size={size}
            sx={hidden ? { display: 'none' } : undefined}
        >
            {renderedLayout}
        </Grid>
    );
};

export default AtFormLayoutRendererResolver;
