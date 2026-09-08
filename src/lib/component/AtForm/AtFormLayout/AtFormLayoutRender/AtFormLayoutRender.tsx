import React from 'react';
import type {
    AtFormChildProps,
    AtFormFieldErrorFallback,
    AtFormUnknownChildProps,
} from '../../../../types/AtForm.type';
import type { AtFormChildren } from '../../../../types/AtFormLayout.type';
import UiRender from '../../AtFormRender/UiRender/UiRender';
import { getFlatChildren, isAtFormLayout } from '../../FormUtils/FormUtils';
import AtFormLayoutRendererResolver from '../AtFormLayoutRendererResolver/AtFormLayoutRendererResolver';

interface AtFormLayoutRenderProps {
    children: AtFormChildren,
    childrenProps: (AtFormChildProps | AtFormUnknownChildProps)[],
    fieldErrorFallback?: AtFormFieldErrorFallback,
    renderBeforeLeaf?: (leafIndex: number) => React.ReactNode,
}

interface RenderNodesResult {
    content: React.ReactNode,
    hasBeforeLeafContent: boolean,
}

const hasRenderableContent = (content: React.ReactNode) => {
    return content !== undefined
        && content !== null
        && content !== false;
};

const AtFormLayoutRender = ({
    children,
    childrenProps,
    fieldErrorFallback,
    renderBeforeLeaf,
}: AtFormLayoutRenderProps) => {
    let leafIndex = 0;

    const renderNodes = (inputChildren: AtFormChildren): RenderNodesResult => {
        const nodes = getFlatChildren(inputChildren);
        let hasBeforeLeafContent = false;

        const content = nodes.map((node, nodeIndex) => {
            if (isAtFormLayout(node)) {
                const firstDescendantLeafIndex = leafIndex;
                const renderedChildren = renderNodes(node.children);
                const descendantProps = childrenProps.slice(firstDescendantLeafIndex, leafIndex);

                hasBeforeLeafContent = hasBeforeLeafContent
                    || renderedChildren.hasBeforeLeafContent;

                // Tabs hide fields with display:none so their values stay mounted and retained.
                // Mirror that behavior on a layout wrapper when every descendant is hidden.
                // A layout containing injected tab navigation must stay visible so the user can
                // still switch tabs even if all of that layout's form fields are inactive.
                const hiddenByTabs = descendantProps.length > 0
                    && descendantProps.every(item => item.isTabSelected === false)
                    && !renderedChildren.hasBeforeLeafContent;

                return (
                    <AtFormLayoutRendererResolver
                        key={`${node.id}-${nodeIndex}`}
                        layout={node}
                        hidden={hiddenByTabs}
                    >
                        {renderedChildren.content}
                    </AtFormLayoutRendererResolver>
                );
            }

            const currentLeafIndex = leafIndex;
            leafIndex += 1;

            const childProps = childrenProps[currentLeafIndex]!;
            const key = childProps?.tProps?.id || currentLeafIndex;
            const beforeLeafContent = renderBeforeLeaf?.(currentLeafIndex);

            if (hasRenderableContent(beforeLeafContent))
                hasBeforeLeafContent = true;

            return (
                <React.Fragment key={key}>
                    {beforeLeafContent}
                    <UiRender
                        childProps={childProps}
                        fieldErrorFallback={fieldErrorFallback}
                    >
                        {node}
                    </UiRender>
                </React.Fragment>
            );
        });

        return {
            content,
            hasBeforeLeafContent,
        };
    };

    return <>{renderNodes(children).content}</>;
};

export default AtFormLayoutRender;
