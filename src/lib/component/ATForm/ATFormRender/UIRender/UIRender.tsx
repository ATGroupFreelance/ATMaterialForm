import React from "react"

import UIBuilder from "../../UIBuilder/UIBuilder"
import { Grid2 } from "@mui/material"

const UIRender = ({ ui, skipForm, skipRender, flexGridProps, tabIndex, wrapperRenderer, wrapperRendererProps = {}, ...restProps }: any) => {    
    //default wrapper is a flex grid
    //Please note wrapper variable must be pascal because its a react component
    let Wrapper = Grid2
    const wrapperProps = {
        ...flexGridProps,
        ...wrapperRendererProps
    }

    if (wrapperRenderer) {
        Wrapper = wrapperRenderer
        wrapperProps['childProps'] = restProps
    }        

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

    return <Wrapper {...wrapperProps} {...wrapperRendererProps}>
        {children}
    </Wrapper>
}

export default UIRender;