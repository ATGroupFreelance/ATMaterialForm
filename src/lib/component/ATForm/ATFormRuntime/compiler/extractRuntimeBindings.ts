import { ATFormFieldDefInterface } from "@/lib/types/ATForm.type";
import { ATFormRuntimeBindingsMap } from "@/lib/types/ATFormRuntime.type";

export function extractRuntimeBindings(
    fields: ATFormFieldDefInterface[],
    prefix = "",
) {
    const result: ATFormRuntimeBindingsMap = {};

    for (const field of fields) {

        const fieldID =
            field.tProps.id;

        const effectiveID =
            prefix
                ? `${prefix}.${fieldID}`
                : fieldID;

        if (field.tProps.runtimeBindings) {
            result[effectiveID] = field.tProps.runtimeBindings;
        }

        const children =
            field.uiProps?.formChildren;

        if (children?.length) {

            Object.assign(
                result,
                extractRuntimeBindings(
                    children,
                    effectiveID,
                ),
            );
        }
    }

    return result;
}