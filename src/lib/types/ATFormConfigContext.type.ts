import { ATEnumsType } from "./Common.type";
import { ATFormCustomComponentInterface, ATTypeInterface } from "./UITypeUtils.type";

interface UploadFilesToServerProps {
    files: FormData,
    authToken?: string
}

interface GetFileProps {
    id: string,
    authToken?: string,
    width?: number,
    height?: number,
}

export interface ATFormConfigContextInterface {
    rtl?: boolean;
    enums?: ATEnumsType;
    uploadFilesToServer?: (props: UploadFilesToServerProps) => Promise<any>;
    maxUploadFileSizeInBytes?: number,
    getFile?: (props: GetFileProps) => Promise<any>;
    localText?: Record<string, string>;
    agGridLocalText?: Record<string, string>;
    customComponents?: ATFormCustomComponentInterface[];
    getLocalText?: (id: string | null | undefined, fallbackLabel?: string) => string | null | undefined;
    getTypeInfo?: (type: string) => ATTypeInterface | undefined,
}

export interface ATFormConfigContextGuaranteedInterface {
    rtl?: boolean;
    enums?: ATEnumsType;
    uploadFilesToServer?: (props: UploadFilesToServerProps) => Promise<any>;
    maxUploadFileSizeInBytes?: number,
    getFile?: (props: GetFileProps) => Promise<any>;
    localText: Record<string, string>;
    agGridLocalText?: Record<string, string>;
    customComponents?: ATFormCustomComponentInterface[];
    getLocalText: (id: string | null | undefined, fallbackLabel?: string) => string | null | undefined;
    getTypeInfo: (type: string) => ATTypeInterface | undefined,
}