export interface ATFormContextType {
    rtl: boolean;
    enums: ATEnumsType;
    uploadFilesToServer: (file: File) => Promise<any>;
    getFile: (id: string) => Promise<any>;
    localText: Record<string, string>;
    agGridLocalText: Record<string, string>;
    customComponents: any;
    getLocalText: (id: string | null | undefined, fallbackLabel?: string) => string | null | undefined;
}