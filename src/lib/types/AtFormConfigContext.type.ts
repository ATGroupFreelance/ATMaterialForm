import { AtEnumsType, AtFormGetLocalTextFunctionType } from "./Common.type";
import { AtFormCustomComponentInterface, AtFormTypeInfoInterface } from "./UiTypeUtils.type";
import type { AtFormAgGridTheme } from "./AtAgGridTheme.type";
import type { AtFormArchiveAdapter } from "./AtFormArchive.type";
import type { AtLocalizeFunction, AtMessageDefinition, AtMessageTranslationMap } from "../localization";

export interface AtFormConfigContextInterface {
    rtl?: boolean;
    enums?: AtEnumsType;
    locale?: string;
    calendar?: string;
    messages?: AtMessageTranslationMap;
    messageDefinitions?: AtMessageDefinition[];
    archive?: AtFormArchiveAdapter;
    maxUploadFileSizeInBytes?: number,
    localText?: Record<string, string>;
    agGridLocalText?: Record<string, string>;
    agGridTheme?: AtFormAgGridTheme;
    customComponents?: AtFormCustomComponentInterface[];
    t?: AtLocalizeFunction;
    getLocalText?: AtFormGetLocalTextFunctionType;
    getTypeInfo?: GetTypeInfoFunctionType,
}

export interface AtFormConfigContextGuaranteedInterface {
    rtl?: boolean;
    enums: AtEnumsType;
    locale: string;
    calendar?: string;
    messages: AtMessageTranslationMap;
    messageDefinitions: AtMessageDefinition[];
    archive?: AtFormArchiveAdapter;
    maxUploadFileSizeInBytes?: number,
    localText: Record<string, string>;
    agGridLocalText?: Record<string, string>;
    agGridTheme?: AtFormAgGridTheme;
    customComponents?: AtFormCustomComponentInterface[];
    t: AtLocalizeFunction;
    getLocalText: AtFormGetLocalTextFunctionType;
    getTypeInfo: GetTypeInfoFunctionType,
}

export type GetTypeInfoFunctionType = (type: string) => AtFormTypeInfoInterface | undefined
