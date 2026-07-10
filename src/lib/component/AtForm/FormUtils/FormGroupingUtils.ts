type FormGroupMap = Record<string, string[]>;

type GroupableChildProps = {
    tProps?: {
        id?: string | number;
        groupDataKey?: string;
    };
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    return !!value && typeof value === 'object' && value.constructor === Object;
};

export const buildFormGroupMap = (
    flatChildrenProps: GroupableChildProps[]
): FormGroupMap => {
    return flatChildrenProps.reduce<FormGroupMap>((result, childProps) => {
        const id = childProps.tProps?.id;
        const groupDataKey = childProps.tProps?.groupDataKey;

        if (id === undefined || id === null || !groupDataKey) {
            return result;
        }

        const normalizedId = String(id);

        result[groupDataKey] ??= [];

        if (!result[groupDataKey].includes(normalizedId)) {
            result[groupDataKey].push(normalizedId);
        }

        return result;
    }, {});
};

export const groupFormDataByGroupKey = <TValue = unknown>(
    data: Record<string, TValue> | null | undefined,
    groupMap: FormGroupMap
): Record<string, TValue | Record<string, TValue>> => {
    if (!data) {
        return {};
    }

    const result: Record<string, TValue | Record<string, TValue>> = { ...data };

    for (const groupKey in groupMap) {
        const fieldIds = groupMap[groupKey];
        const groupedValue: Record<string, TValue> = {};

        for (const fieldId of fieldIds) {
            if (Object.prototype.hasOwnProperty.call(result, fieldId)) {
                groupedValue[fieldId] = result[fieldId] as TValue;
                delete result[fieldId];
            }
        }

        if (Object.keys(groupedValue).length > 0) {
            result[groupKey] = groupedValue;
        }
    }

    return result;
};

export const flattenGroupedFormData = <TValue = unknown>(
    data: Record<string, TValue | Record<string, TValue>> | null | undefined,
    groupMap: FormGroupMap
): Record<string, TValue> | null | undefined => {
    if (data === null || data === undefined) {
        return data;
    }

    if (!isPlainObject(data)) {
        return data as Record<string, TValue>;
    }

    const result: Record<string, TValue> = { ...data } as Record<string, TValue>;

    for (const groupDataKey in groupMap) {
        const groupedValue = data[groupDataKey];

        if (!isPlainObject(groupedValue)) {
            continue;
        }

        const fieldIds = groupMap[groupDataKey];

        for (const fieldId of fieldIds) {
            if (Object.prototype.hasOwnProperty.call(groupedValue, fieldId)) {
                result[fieldId] = groupedValue[fieldId] as TValue;
            }
        }

        delete result[groupDataKey];
    }

    return result;
};
