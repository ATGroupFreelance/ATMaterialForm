import { AtFormFieldDefInterface } from "../../../../types/AtForm.type";
import { AtFormDefinitionNode } from "../../../../types/AtFormLayout.type";
import { AtFormRuntimeBindingsMap } from "../../../../types/AtFormRuntime.type";
import { getFlatChildren, isAtFormLayout } from "../../FormUtils/FormUtils";

const isAtFormFieldDefinition = (value: unknown): value is AtFormFieldDefInterface => {
    return !!value &&
        typeof value === "object" &&
        !isAtFormLayout(value) &&
        "tProps" in value;
};

const getDefinitionChildren = (children: unknown): AtFormDefinitionNode[] => {
    return getFlatChildren(children)
        .filter((item): item is AtFormDefinitionNode => isAtFormLayout(item) || isAtFormFieldDefinition(item));
};

export function extractRuntimeBindings(
    definitions: AtFormDefinitionNode[],
    prefix = "",
) {
    const result: AtFormRuntimeBindingsMap = {};

    for (const definition of definitions) {
        if (isAtFormLayout(definition)) {
            Object.assign(
                result,
                extractRuntimeBindings(
                    getDefinitionChildren(definition.children),
                    prefix,
                ),
            );
            continue;
        }

        if (!isAtFormFieldDefinition(definition))
            continue;

        const fieldId = definition.tProps.id;
        const effectiveId = prefix
            ? `${prefix}.${fieldId}`
            : fieldId;

        if (definition.tProps.runtimeBindings)
            result[effectiveId] = definition.tProps.runtimeBindings;

        const children = getDefinitionChildren(definition.uiProps?.formChildren);

        if (children.length) {
            Object.assign(
                result,
                extractRuntimeBindings(children, effectiveId),
            );
        }
    }

    return result;
}
