import React from "react"

import UIBuilder from "../../UIBuilder/UIBuilder"
import { Grid } from "@mui/material"
import { ATFormChildProps, ATUIRenderProps } from "@/lib/types/ATForm.type"

const UIRender = ({ children, childProps }: ATUIRenderProps) => {
    if (childProps.tProps?.skipRender)
        return null;

    //default wrapper is a flex grid
    //Please note wrapper variable must be pascal because its a react component
    let Wrapper = Grid
    let wrapperProps = {
        //Pass the size as the wrapper props, this is the wrappers can use it but its not passed to children,
        //if size does not exists use 12 as the default value
        size: childProps.tProps?.size || 12,
        ...(childProps.tProps?.wrapperRendererProps || {}),
    }

    if (childProps.tProps?.wrapperRenderer) {
        Wrapper = childProps.tProps?.wrapperRenderer
        wrapperProps = {
            childProps,
            ...(childProps.tProps?.wrapperRendererProps || {}),
        }
    }

    // console.log('UIRender', {skipForm, isValid: React.isValidElement(ui), ui})    

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

    if (!Wrapper)
        return output

    return <Wrapper {...wrapperProps}>
        {output}
    </Wrapper>
}

export default UIRender;