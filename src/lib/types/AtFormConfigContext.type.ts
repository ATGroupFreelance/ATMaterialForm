import { AtEnumsType } from "./Common.type";
import { AtFormCustomComponentInterface, AtFormTypeInfoInterface } from "./UiTypeUtils.type";
import type { AtFormAgGridTheme } from "./AtAgGridTheme.type";
import type { AtFormArchiveAdapter } from "./AtFormArchive.type";
import type { AtLocalizeFunction, AtMessageDefinition, AtMessageTranslationMap } from "../localization";
import type { AtFormCascadeLeafSearchProvider, AtFormCascadePathResolver, AtFormCascadeProvider } from "./ui/CascadeComboBox.type";

export interface AtFormConfigContextInterface {
    rtl?: boolean;
    enums?: AtEnumsType;
    locale?: string;
    calendar?: string;
    messages?: AtMessageTranslationMap;
    messageDefinitions?: AtMessageDefinition[];
    archive?: AtFormArchiveAdapter;
    maxUploadFileSizeInBytes?: number,
    localizationRevision?: number;
    agGridTheme?: AtFormAgGridTheme;
    customComponents?: AtFormCustomComponentInterface[];
    t?: AtLocalizeFunction;
    cascadeProviders?: Record<string, AtFormCascadeProvider>;
    cascadeResolvers?: Record<string, AtFormCascadePathResolver>;
    cascadeLeafSearchProviders?: Record<string, AtFormCascadeLeafSearchProvider>;
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
    localizationRevision: number;
    agGridTheme?: AtFormAgGridTheme;
    customComponents?: AtFormCustomComponentInterface[];
    t: AtLocalizeFunction;
    cascadeProviders?: Record<string, AtFormCascadeProvider>;
    cascadeResolvers?: Record<string, AtFormCascadePathResolver>;
    cascadeLeafSearchProviders?: Record<string, AtFormCascadeLeafSearchProvider>;
    getTypeInfo: GetTypeInfoFunctionType,
}

export type GetTypeInfoFunctionType = (type: string) => AtFormTypeInfoInterface | undefined
