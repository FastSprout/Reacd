import { relative, resolve } from 'node:path';

export const LAYERS = [
  'core',
  'schema',
  'components',
  'renderer',
  'adapter',
  'state',
] as const;

const PUBLIC_ENTRIES = new Set([
  'index.ts',
  'generative.ts',
  'contract.ts',
  'templates.ts',
  'renderer.tsx',
  'jsx-runtime.ts',
  'jsx-dev-runtime.ts',
  'bootstrap.ts',
]);

export function layerOf(file: string, root: string): number {
  const segment = relative(resolve(root, 'src'), file).split('/')[0];
  return LAYERS.findIndex((layer) => layer === segment);
}

export function isPublicEntry(file: string, root: string): boolean {
  return PUBLIC_ENTRIES.has(relative(resolve(root, 'src'), file));
}

export function isTestModule(file: string): boolean {
  return /(?:^|\/)(?:__tests__|test-support|e2e)(?:\/|$)|\.(?:test|spec)\./.test(file);
}

export function isVendorModule(file: string, root: string): boolean {
  return relative(root, file).startsWith('src/adapter/shadcn/vendor/');
}

export function isProductionModule(file: string, root: string): boolean {
  return (
    relative(root, file).startsWith('src/') &&
    /\.[cm]?tsx?$/.test(file) &&
    !isTestModule(file) &&
    !isVendorModule(file, root)
  );
}
