import { AtFormRenderProps } from "../../../types/AtForm.type"
import UiRender from "./UiRender/UiRender"

const AtFormRender = ({ children, childrenProps }: AtFormRenderProps) => {
    return children.map((item: any, index: number) => {
        return <UiRender key={childrenProps[index]?.tProps?.id || index} childProps={childrenProps[index]}>
            {item}
        </UiRender>
    })
}

export default AtFormRender;