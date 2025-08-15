import React, { Suspense } from "react";
import UIBuilder from "../../UIBuilder/UIBuilder";
import { ATFormChildProps, ATUIRenderProps } from "@/lib/types/ATForm.type";
import UIRenderWrapperResolver from "./UIRenderWrapperResolver/UIRenderWrapperResolver";

const UIRenderDebugWrapper = React.lazy(() => import("./UIRenderDebugWrapper/UIRenderDebugWrapper"));

function UIRender({ children, childProps }: ATUIRenderProps) {
    if (childProps.tProps?.skipRender) return null;

    const debug = childProps.tProps?.debug === true;

    // Render actual UI field
    const renderedElement = React.isValidElement(children) ?
        childProps?.tProps?.skipForm ?
            //Example: <div skipForm={true}><TextBox /></div>
            children
            :
            //Example: <TextBox />
            React.cloneElement(children, { ...(childProps?.uiProps || {}) })
        :
        //Example: {
        //     type: 'TextBox'
        // }
        <UIBuilder childProps={childProps as ATFormChildProps} />;

    // Wrap the field in debug UI (if enabled)
    const maybeDebuggedElement = debug ? (
        <Suspense fallback={renderedElement}>
            <UIRenderDebugWrapper childProps={childProps}>
                {renderedElement}
            </UIRenderDebugWrapper>
        </Suspense>
    ) : renderedElement;

    // Wrap final result in layout (Grid etc.)
    return (
        <UIRenderWrapperResolver
            wrapperRenderer={{
                ...(childProps?.tProps?.wrapperRenderer || {}),
                props: {
                    ...(childProps?.tProps?.wrapperRenderer?.props || {}),
                    childProps,
                }
            }}
        >
            {maybeDebuggedElement}
        </UIRenderWrapperResolver>
    );
}

export default UIRender;
