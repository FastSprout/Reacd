export const BUNDLE_POLICY = {
  maxChunkBytes: 500_000,
  entry: 'index.html',
  deferredViews: [
    'catalog/layout-examples.tsx',
    'catalog/field-examples.tsx',
    'catalog/data-examples.tsx',
    'catalog/action-examples.tsx',
    'catalog/navigation-examples.tsx',
    'generative/playground.tsx',
  ],
} as const;
