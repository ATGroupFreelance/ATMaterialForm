import type { ComponentType } from 'react';
import manifest from './exampleManifest.json';

export interface ExampleComponentInterface {
  ref?: unknown;
  onChange?: unknown;
}

export interface ExampleDefinition {
  id: string;
  label: string;
  sourcePath: string;
  component: ComponentType<any>;
  refEnabled?: boolean;
  onChangeEnabled?: boolean;
}

const modules = import.meta.glob(
  ['/src/examples/*/*.{tsx,jsx}', '/src/beta/*/*.{tsx,jsx}'],
  { eager: true },
) as Record<string, { default?: ComponentType<any> }>;

export const humanizeExampleId = (id: string) => id
  .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  .replace(/\s+/g, ' ')
  .trim();

export const exampleList: ExampleDefinition[] = manifest.map((entry) => {
  const loadedModule = modules[entry.sourcePath];

  if (!loadedModule?.default) {
    throw new Error(`Example module not found for ${entry.id}: ${entry.sourcePath}`);
  }

  return {
    ...entry,
    label: humanizeExampleId(entry.id),
    component: loadedModule.default,
  };
});

export const exampleIds = exampleList.map((example) => example.id);
