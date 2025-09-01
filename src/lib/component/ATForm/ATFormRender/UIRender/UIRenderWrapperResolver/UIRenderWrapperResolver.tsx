import { ATFormChildProps, ATFormUnknownChildProps } from "@/lib/types/ATForm.type";
import { Grid } from "@mui/material";
import { ComponentType, lazy, Suspense } from "react";
import { getTabVisibilityStyle } from "../../../FormUtils/FormUtils";
import { ATFormWrapperConfig } from "@/lib/types/ATFormFieldWrapper.type";

interface UIRenderWrapperResolverProps {
    children: React.ReactNode,
    wrapperRenderer?: ATFormWrapperConfig,
    childProps: ATFormChildProps | ATFormUnknownChildProps,
}

const builtInWrappers: Record<string, React.LazyExoticComponent<ComponentType<any>>> = {
    Collapse: lazy(() => import('../../../ATFormTemplateWrappers/ATFormCollapseWrapper/ATFormCollapseWrapper')),
    Button: lazy(() => import('../../../ATFormTemplateWrappers/ATFormButtonWrapper/ATFormButtonWrapper')),
    ButtonDialog: lazy(() => import('../../../ATFormTemplateWrappers/ATFormButtonDialogWrapper/ATFormButtonDialogWrapper')),
};

const UIRenderWrapperResolver = ({ children, wrapperRenderer, childProps }: UIRenderWrapperResolverProps) => {
    const renderer = wrapperRenderer?.renderer
    const rendererProps: { childProps: ATFormChildProps | ATFormUnknownChildProps, config: Record<string, any> } = {
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
    const tPropsSize = rendererProps.childProps.tProps?.size ? { md: rendererProps.childProps.tProps?.size, xs: 12 } : null
    const size = rendererProps.config.size || tPropsSize || 12

    //Default/Fallback to Grid
    return <Grid {...restGridProps} size={size} sx={{ ...(sx || {}), ...getTabVisibilityStyle(childProps.isTabSelected) }}>{children}</Grid>

}

export default UIRenderWrapperResolver;