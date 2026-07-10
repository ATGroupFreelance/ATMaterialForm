import { AtFormChildProps, AtFormUnknownChildProps } from "../../../../../types/AtForm.type";
import { Grid } from "@mui/material";
import { ComponentType, lazy, Suspense } from "react";
import { getTabVisibilityStyle } from "../../../FormUtils/FormUtils";
import { AtFormWrapperConfig } from "../../../../../types/AtFormFieldWrapper.type";

interface UiRenderWrapperResolverProps {
    children: React.ReactNode,
    wrapperRenderer?: AtFormWrapperConfig,
    childProps: AtFormChildProps | AtFormUnknownChildProps,
}

const builtInWrappers: Record<string, React.LazyExoticComponent<ComponentType<any>>> = {
    Collapse: lazy(() => import('../../../AtFormTemplateWrappers/AtFormCollapseWrapper/AtFormCollapseWrapper')),
    Button: lazy(() => import('../../../AtFormTemplateWrappers/AtFormButtonWrapper/AtFormButtonWrapper')),
    ButtonDialog: lazy(() => import('../../../AtFormTemplateWrappers/AtFormButtonDialogWrapper/AtFormButtonDialogWrapper')),
};

const UiRenderWrapperResolver = ({ children, wrapperRenderer, childProps }: UiRenderWrapperResolverProps) => {
    const renderer = wrapperRenderer?.renderer
    const rendererProps: { childProps: AtFormChildProps | AtFormUnknownChildProps, config: Record<string, any> } = {
        childProps,
        config: wrapperRenderer?.config || {},
    }

    if (typeof renderer === 'string' && renderer === 'None')
        return children
    else if (typeof renderer === 'string' && builtInWrappers[renderer]) {
        const LazyComponent = builtInWrappers[renderer]

        return <Suspense fallback={null}>
            <LazyComponent {...rendererProps}>{children}</LazyComponent>
        </Suspense>
    }
    else if (typeof renderer === 'function') {
        const CustomComponent = renderer

        return <CustomComponent {...rendererProps}>{children}</CustomComponent>
    }

    const { sx, ...restGridProps } = rendererProps.config || {}
    const baseSize = rendererProps.childProps.tProps?.size;

    const tPropsSize = baseSize
        ? typeof baseSize === "object"
            ? baseSize
            : { md: baseSize, xs: 12 }
        : null;

    const size = rendererProps.config.size || tPropsSize || 12

    //Default/Fallback to Grid
    return <Grid {...restGridProps} size={size} sx={{ ...(sx || {}), ...getTabVisibilityStyle(childProps.isTabSelected) }}>{children}</Grid>

}

export default UiRenderWrapperResolver;