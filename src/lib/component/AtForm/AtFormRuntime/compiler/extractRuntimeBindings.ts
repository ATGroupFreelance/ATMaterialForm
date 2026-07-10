import { AtFormFieldDefInterface } from "../../../../types/AtForm.type";
import { AtFormRuntimeBindingsMap } from "../../../..//types/AtFormRuntime.type";

export function extractRuntimeBindings(
    fields: AtFormFieldDefInterface[],
    prefix = "",
) {
    const result: AtFormRuntimeBindingsMap = {};

    for (const field of fields) {

        const fieldId =
            field.tProps.id;

        const effectiveId =
            prefix
                ? `${prefix}.${fieldId}`
                : fieldId;

        if (field.tProps.runtimeBindings) {
            result[effectiveId] = field.tProps.runtimeBindings;
        }

        const children =
            field.uiProps?.formChildren;

        if (children?.length) {

            Object.assign(
                result,
                extractRuntimeBindings(
                    children,
                    effectiveId,
                ),
            );
        }
    }

    return result;
}