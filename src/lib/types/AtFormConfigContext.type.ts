import { AtEnumsType, AtFormGetLocalTextFunctionType } from "./Common.type";
import { AtFormCustomComponentInterface, AtFormTypeInfoInterface } from "./UiTypeUtils.type";

export interface UploadFilesToServerProps {
    files: FormData,
    authToken?: string
}

interface GetFileProps {
    id: string,
    authToken?: string,
    width?: number,
    height?: number,
}

export interface AtFormConfigContextInterface {
    rtl?: boolean;
    enums?: AtEnumsType;
    uploadFilesToServer?: (props: UploadFilesToServerProps) => Promise<any>;
    maxUploadFileSizeInBytes?: number,
    getFile?: (props: GetFileProps) => Promise<any>;
    localText?: Record<string, string>;
    agGridLocalText?: Record<string, string>;
    customComponents?: AtFormCustomComponentInterface[];
    getLocalText?: AtFormGetLocalTextFunctionType;
    getTypeInfo?: GetTypeInfoFunctionType,
}

export interface AtFormConfigContextGuaranteedInterface {
    rtl?: boolean;
    enums?: AtEnumsType;
    uploadFilesToServer?: (props: UploadFilesToServerProps) => Promise<any>;
    maxUploadFileSizeInBytes?: number,
    getFile?: (props: GetFileProps) => Promise<any>;
    localText: Record<string, string>;
    agGridLocalText?: Record<string, string>;
    customComponents?: AtFormCustomComponentInterface[];
    getLocalText: AtFormGetLocalTextFunctionType;
    getTypeInfo: GetTypeInfoFunctionType,
}

export type GetTypeInfoFunctionType = (type: string) => AtFormTypeInfoInterface | undefined