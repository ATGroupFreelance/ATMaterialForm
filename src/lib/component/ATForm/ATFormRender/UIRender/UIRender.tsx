import UIBuilder from "../../UIBuilder/UIBuilder"
import { ATFormChildProps, ATUIRenderProps } from "@/lib/types/ATForm.type"
import UIRenderWrapperResolver from "./UIRenderWrapperResolver/UIRenderWrapperResolver"
import React from "react";

const UIRender = ({ children, childProps }: ATUIRenderProps) => {
    if (childProps.tProps?.skipRender)
        return null;

    return <UIRenderWrapperResolver
        wrapperProps={{ childProps, ...(childProps?.tProps?.wrapperRendererProps || {}) }}
        wrapperRenderer={childProps?.tProps?.wrapperRenderer}
    >
        {
            React.isValidElement(children) ?
                childProps?.tProps?.skipForm ?
                    //Example: <div skipForm={true}><TextBox /></div>
                    children
                    :
                    //Example: <TextBox />
                    React.cloneElement(children, { ...(childProps?.uiProps || {}) })
                :
                //Example: {
                //     type: 'TextBox'
                // }
                <UIBuilder childProps={childProps as ATFormChildProps} />
        }
    </UIRenderWrapperResolver>
}

export default UIRender;