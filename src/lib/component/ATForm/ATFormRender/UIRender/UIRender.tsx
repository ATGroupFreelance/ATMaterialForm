import React from "react"

import UIBuilder from "../../UIBuilder/UIBuilder"
import { Grid } from "@mui/material"

const UIRender = ({
    ui,
    skipForm,
    skipRender,
    tabIndex, // eslint-disable-line @typescript-eslint/no-unused-vars
    size,
    wrapperRenderer,
    wrapperRendererProps = {},
    ...restProps }: any
) => {
    //default wrapper is a flex grid
    //Please note wrapper variable must be pascal because its a react component
    let Wrapper = Grid
    const wrapperProps = {
        //Pass the size as the wrapper props, this is the wrappers can use it but its not passed to children,
        //if size does not exists use 12 as the default value
        size: size || 12,        
        ...wrapperRendererProps,
    }

    if (wrapperRenderer) {
        Wrapper = wrapperRenderer
        wrapperProps['childProps'] = restProps
    }

    // console.log('UIRender', {skipForm, isValid: React.isValidElement(ui), ui})

    const children = (
        !skipRender
        &&
        (
            React.isValidElement(ui) ?
                skipForm ?
                    //Example: <div skipForm={true}><TextBox/></div>
                    ui
                    :
                    //Example: <TextBox/>
                    React.cloneElement(ui, { ...restProps, type: restProps.type.name || restProps.type })
                :
                //Example: {
                //     type: 'TextBox'
                // }
                <UIBuilder {...restProps} />
        )
    )

    if (!Wrapper)
        return children    

    return <Wrapper {...wrapperProps}>
        {children}
    </Wrapper>
}

export default UIRender;