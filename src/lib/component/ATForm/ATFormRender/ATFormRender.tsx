import { ATFormRenderProps } from "@/lib/types/ATForm.type"
import UIRender from "./UIRender/UIRender"

const ATFormRender = ({ children, childrenProps }: ATFormRenderProps) => {
    return children.map((item: any, index: number) => {
        return <UIRender key={childrenProps[index]?.tProps?.id || index} childProps={childrenProps[index]}>
            {item}
        </UIRender>
    })
}

export default ATFormRender;