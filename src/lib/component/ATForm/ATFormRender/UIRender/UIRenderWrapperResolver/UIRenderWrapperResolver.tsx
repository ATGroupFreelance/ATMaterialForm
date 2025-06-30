import { ATFormChildProps, ATFormUnknownChildProps, ATFormWrapperRendererType } from "@/lib/types/ATForm.type";
import { Grid } from "@mui/material";
import { ComponentType, lazy, Suspense } from "react";

interface UIRenderWrapperResolverProps {
    children: React.ReactNode,
    wrapperRenderer?: ATFormWrapperRendererType,
    wrapperProps: { childProps: ATFormChildProps | ATFormUnknownChildProps } & Record<string, any>;
}

const builtInWrappers: Record<string, React.LazyExoticComponent<ComponentType<any>>> = {
    Collapse: lazy(() => import('../../../ATFormTemplateWrappers/ATFormCollapseWrapper/ATFormCollapseWrapper')),
};

const UIRenderWrapperResolver = ({ children, wrapperRenderer, wrapperProps }: UIRenderWrapperResolverProps) => {
    if (typeof wrapperRenderer === 'string' && wrapperRenderer === 'None')
        return children
    else if (typeof wrapperRenderer === 'string' && builtInWrappers[wrapperRenderer]) {
        const LazyComponent = builtInWrappers[wrapperRenderer]

        return <Suspense fallback={null}>
            <LazyComponent {...wrapperProps}>{children}</LazyComponent>
        </Suspense>
    }
    else if (typeof wrapperRenderer === 'function') {
        const CustomComponent = wrapperRenderer

        return <CustomComponent {...wrapperProps}>{children}</CustomComponent>
    }

    //Add size and remove child props for Grid wrapper type
    const { childProps, ...gridWrapperProps } = {
        ...wrapperProps,
        size: wrapperProps?.childProps.tProps?.size || 12,
    }

    //Ignore unused warning
    void childProps;

    //Default/Fallback to Grid
    return <Grid {...gridWrapperProps}>{children}</Grid>

}

export default UIRenderWrapperResolver;