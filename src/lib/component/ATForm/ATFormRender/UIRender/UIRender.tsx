import React, { ComponentType } from "react"

import UIBuilder from "../../UIBuilder/UIBuilder"
import { Grid, GridProps } from "@mui/material"
import { ATFormChildProps, ATFormWrapperRendererProps, ATUIRenderProps } from "@/lib/types/ATForm.type"

const UIRender = ({ children, childProps }: ATUIRenderProps) => {
    if (childProps.tProps?.skipRender)
        return null;

    const output = (
        React.isValidElement(children) ?
            childProps?.tProps?.skipForm ?
                //Example: <div skipForm={true}><TextBox/></div>
                children
                :
                //Example: <TextBox/>
                React.cloneElement(children, { ...(childProps?.uiProps || {}) })
            :
            //Example: {
            //     type: 'TextBox'
            // }
            <UIBuilder childProps={childProps as ATFormChildProps} />
    )

    if (childProps.tProps?.wrapperRenderer) {
        //Please note wrapper must be pascal case, otherwise it will not work
        const Wrapper: ComponentType<ATFormWrapperRendererProps> = childProps.tProps.wrapperRenderer;

        const wrapperProps: ATFormWrapperRendererProps = {
            childProps,
            ...(childProps.tProps?.wrapperRendererProps || {}),
        };

        return <Wrapper {...wrapperProps}>{output}</Wrapper>;
    }
    else {
        const wrapperProps: GridProps = {
            size: childProps.tProps?.size || 12,
            ...(childProps.tProps?.wrapperRendererProps || {}),
        };

        return <Grid {...wrapperProps}>{output}</Grid>;
    }
}

export default UIRender;