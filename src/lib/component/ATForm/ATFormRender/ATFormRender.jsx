import React from "react"
import UIRender from "./UIRender/UIRender"

const ATFormRender = ({ children, formChildrenProps }) => {
    return children.map((item, index) => {
        const currentChildProps = formChildrenProps[index]

        return <UIRender key={currentChildProps.id} ui={item} {...currentChildProps} />
    })
}

export default ATFormRender;