import React from "react"

import UIBuilder from "../../UIBuilder/UIBuilder"
import { Grid2 } from "@mui/material"

const UIRender = ({ ui, skipForm, skipRender, tabIndex, size, wrapperRenderer, wrapperRendererProps = {}, ...restProps }: any) => {
    //default wrapper is a flex grid
    //Please note wrapper variable must be pascal because its a react component
    let Wrapper = Grid2
    const wrapperProps = {
        ...wrapperRendererProps
    }

    if (wrapperRenderer) {
        Wrapper = wrapperRenderer
        wrapperProps['childProps'] = restProps
    }
    else {
        //If wrapper is flex grid pass the size as the wrapper props if size does not exists use 12 as the default value
        wrapperProps['size'] = size || 12
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

    console.log('wrapperProps', { wrapperProps, restProps })

    if (!Wrapper)
        return children

    return <Wrapper {...wrapperProps} {...wrapperRendererProps}>
        {children}
    </Wrapper>
}

export default UIRender;