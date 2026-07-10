export type AtFormFormDataType<T = any> = {
    [key: string]: {
        value: T;
        type?: string;
        changeId?: number;
    };
};

export type AtFormFormDataKeyValueType = {
    [key: string]: any,
}

export type AtFormFormDataSemiKeyValueType = {
    [key: string]: any,
}

export type AtFormFormDataFormat = 'FormData' | 'FormDataKeyValue' | 'FormDataSemiKeyValue';