import React from "react"
import UIBuilder from "../UIBuilder/UIBuilder"
import { Grid2 } from "@mui/material"

const ATFormRender = ({ children, formChildrenProps }) => {
    console.log('formChildrenProps', {
        children,
        formChildrenProps
    })

    return children.map((item, index) => {
        const { formskip, skipRender, flexGridProps, tabIndex, ...itemProps } = formChildrenProps[index]

        console.log('flexGridProps', flexGridProps)

        return <Grid2
            key={itemProps.id}
            {...flexGridProps}
        >
            {
                !skipRender
                &&
                (
                    React.isValidElement(item) ?
                        formskip ?
                            //Example: <div formskip={true}><TextBox/></div>
                            item
                            :
                            //Example: <TextBox/>
                            React.cloneElement(item, { ...itemProps, type: itemProps.type.name || itemProps.type, key: itemProps.id })
                        :
                        //Example: {
                        //     type: 'TextBox'
                        // }
                        <UIBuilder key={itemProps.id} {...itemProps} />
                )
            }
        </Grid2>
    })
}

export default ATFormRender;