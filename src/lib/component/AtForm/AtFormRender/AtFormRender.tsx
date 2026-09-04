import { AtFormRenderProps } from "../../../types/AtForm.type"
import UiRender from "./UiRender/UiRender"

const AtFormRender = ({ children, childrenProps, fieldErrorFallback }: AtFormRenderProps) => {
    return children.map((item: any, index: number) => {
        return <UiRender key={childrenProps[index]?.tProps?.id || index} childProps={childrenProps[index]} fieldErrorFallback={fieldErrorFallback}>
            {item}
        </UiRender>
    })
}

export default AtFormRender;