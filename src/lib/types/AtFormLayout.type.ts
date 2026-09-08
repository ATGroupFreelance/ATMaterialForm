import type React from 'react';
import type { AtFormFieldDefInterface, AtFormGridSize } from './AtForm.type';
import type { AtFormCardLayoutConfig } from './layouts/CardLayout.type';
import type { AtFormBoxLayoutConfig } from './layouts/BoxLayout.type';
import type { AtFormSectionLayoutConfig } from './layouts/SectionLayout.type';
import type { AtFormPaperLayoutConfig } from './layouts/PaperLayout.type';

/** Shared shape used by layout definitions and custom renderer props. */
export interface AtFormLayoutBaseInterface {
    id: string,
    size?: AtFormGridSize,
}

/** Props received by a custom layout renderer. */
export interface AtFormLayoutRendererProps<TConfig = Record<string, unknown>> extends AtFormLayoutBaseInterface {
    children: React.ReactNode,
    config?: TConfig,
}

export interface AtFormBuiltInLayoutConfigsMap {
    Card: AtFormCardLayoutConfig,
    Box: AtFormBoxLayoutConfig,
    Section: AtFormSectionLayoutConfig,
    Paper: AtFormPaperLayoutConfig,
}

export type AtFormBuiltInLayoutType = keyof AtFormBuiltInLayoutConfigsMap;

/**
 * Broad storage/runtime renderer type. The localized `any` represents an
 * existential custom-renderer config; createLayout overloads preserve the
 * consumer's concrete config type.
 */
export type AtFormLayoutRenderer =
    | AtFormBuiltInLayoutType
    | React.ComponentType<AtFormLayoutRendererProps<any>>;

/** Interface is deliberate: it is the recursion boundary for children. */
export interface AtFormLayoutDefInterface extends AtFormLayoutBaseInterface {
    kind: 'layout',
    renderer: AtFormLayoutRenderer,
    config?: unknown,
    children: AtFormChildren,
}

export type AtFormDefinitionNode =
    | AtFormFieldDefInterface
    | AtFormLayoutDefInterface;

export type AtFormChildNode =
    | React.ReactNode
    | AtFormDefinitionNode;

export type AtFormChildren =
    | AtFormChildNode
    | AtFormChildNode[];

export type AtFormBuiltInLayoutCreateProps<K extends AtFormBuiltInLayoutType> =
    AtFormLayoutBaseInterface & {
        renderer: K,
        config?: AtFormBuiltInLayoutConfigsMap[K],
    };

export type AtFormCustomLayoutCreateProps<TConfig = Record<string, unknown>> =
    AtFormLayoutBaseInterface & {
        renderer: React.ComponentType<AtFormLayoutRendererProps<TConfig>>,
        config?: TConfig,
    };

export type AtFormBuiltInLayoutDef<K extends AtFormBuiltInLayoutType = AtFormBuiltInLayoutType> =
    Omit<AtFormLayoutDefInterface, 'renderer' | 'config'> & {
        renderer: K,
        config?: AtFormBuiltInLayoutConfigsMap[K],
    };

export type AtFormCustomLayoutDef<TConfig = Record<string, unknown>> =
    Omit<AtFormLayoutDefInterface, 'renderer' | 'config'> & {
        renderer: React.ComponentType<AtFormLayoutRendererProps<TConfig>>,
        config?: TConfig,
    };
