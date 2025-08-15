import { ATFormChildProps, ATFormUnknownChildProps } from "@/lib/types/ATForm.type";
import { Grid } from "@mui/material";
import { ComponentType, lazy, Suspense } from "react";
import { getTabVisibilityStyle } from "../../../FormUtils/FormUtils";
import { ATFormWrapperConfig } from "@/lib/types/ATFormFieldWrapper.type";

interface UIRenderWrapperResolverProps {
    children: React.ReactNode,
    wrapperRenderer?: ATFormWrapperConfig,    
}

const builtInWrappers: Record<string, React.LazyExoticComponent<ComponentType<any>>> = {
    Collapse: lazy(() => import('../../../ATFormTemplateWrappers/ATFormCollapseWrapper/ATFormCollapseWrapper')),
    Button: lazy(() => import('../../../ATFormTemplateWrappers/ATFormButtonWrapper/ATFormButtonWrapper')),
    ButtonDialog: lazy(() => import('../../../ATFormTemplateWrappers/ATFormButtonDialogWrapper/ATFormButtonDialogWrapper')),
};

const UIRenderWrapperResolver = ({ children, wrapperRenderer }: UIRenderWrapperResolverProps) => {
    const renderer = wrapperRenderer?.renderer
    const rendererProps: { childProps: ATFormChildProps | ATFormUnknownChildProps; sx?: any } & Record<string, any> = (wrapperRenderer?.props || {})

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

    //Add size and remove child props for Grid wrapper type
    const { childProps, sx, ...gridWrapperProps } = {
        ...rendererProps,
        size: rendererProps?.childProps.tProps?.size || 12,
    }

    //Ignore unused warning
    void childProps;

    //Default/Fallback to Grid
    return <Grid {...gridWrapperProps} sx={{ ...(sx || {}), ...getTabVisibilityStyle(childProps.isTabSelected) }}>{children}</Grid>

}

export default UIRenderWrapperResolver;