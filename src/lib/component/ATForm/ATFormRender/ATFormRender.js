import React from "react"
import UIBuilder from "../UIBuilder/UIBuilder"
import { Grid } from "@mui/material"

const ATFormRender = ({ children, formChildrenProps }) => {
    console.log('formChildrenProps', {
        children,
        formChildrenProps
    })

    return children.map((item, index) => {
        const { formskip, skipRender, flexGridProps, tabIndex, ...itemProps } = formChildrenProps[index]

        return <Grid
            key={itemProps.id}
            item
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
        </Grid>
    })
}

export default ATFormRender;