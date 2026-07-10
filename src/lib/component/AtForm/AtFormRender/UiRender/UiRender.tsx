import React, { Suspense } from "react";
import UiBuilder from "../../UiBuilder/UiBuilder";
import { AtFormChildProps, AtUiRenderProps } from "../../../../types/AtForm.type";
import UiRenderWrapperResolver from "./UiRenderWrapperResolver/UiRenderWrapperResolver";

const UiRenderDebugWrapper = React.lazy(() => import("./UiRenderDebugWrapper/UiRenderDebugWrapper"));

function UiRender({ children, childProps }: AtUiRenderProps) {
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
        <UiBuilder childProps={childProps as AtFormChildProps} />;

    // Wrap the field in debug UI (if enabled)
    const maybeDebuggedElement = debug ? (
        <Suspense fallback={renderedElement}>
            <UiRenderDebugWrapper childProps={childProps}>
                {renderedElement}
            </UiRenderDebugWrapper>
        </Suspense>
    ) : renderedElement;

    // Wrap final result in layout (Grid etc.)
    return (
        <UiRenderWrapperResolver
            wrapperRenderer={childProps?.tProps?.wrapperRenderer || {}}
            childProps={childProps}
        >
            {maybeDebuggedElement}
        </UiRenderWrapperResolver>
    );
}

export default UiRender;
