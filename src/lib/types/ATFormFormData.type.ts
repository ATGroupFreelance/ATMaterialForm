export type ATFormFormDataType = {
    [key: string]: {
        value: any,
        type?: string,
        changeID?: number,
    }
}

export type ATFormFormDataKeyValueType = {
    [key: string]: any,
}

export type ATFormFormDataSemiKeyValueType = {
    [key: string]: any,
}

export type ATFormFormDataFormat = 'FormData' | 'FormDataKeyValue' | 'FormDataSemiKeyValue';