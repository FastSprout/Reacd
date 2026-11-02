import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import shared from '../vite.config.js';
import conformance from '../vite.conformance.config.js';
import documentation from '../vite.site-build.config.js';

const at = (path: string) => fileURLToPath(new URL(path, import.meta.url));

it('keeps shared plugins aliases and chunks independent from fixture hosts', () => {
  expect(shared.root).toBeUndefined();
  expect(shared.build?.outDir).toBeUndefined();
  expect(shared.build?.rolldownOptions?.input).toBeUndefined();
  expect(shared.plugins).toBeDefined();
  expect(shared.resolve?.alias).toMatchObject({
    '@fastsprout/reacd': at('../src/index.ts'),
    '@fastsprout/reacd/bootstrap': at('../src/bootstrap.ts'),
  });
  expect(shared.build?.rolldownOptions?.output).toBeDefined();
});

it('builds every private host with shared assets and an absolute cache output', () => {
  expect(conformance.root).toBe(at('../tooling/conformance'));
  expect(conformance.publicDir).toBe(at('../tooling/site/public'));
  expect(conformance.build?.outDir).toBe(at('../.cache/conformance-dist'));
  expect(conformance.build?.emptyOutDir).toBe(true);
  expect(conformance.build?.manifest).toBe(true);
  expect(conformance.build?.rolldownOptions?.input).toEqual({
    compositionSafety: at('../tooling/conformance/composition-safety.html'),
    index: at('../tooling/conformance/index.html'),
    temporalRecovery: at('../tooling/conformance/temporal-recovery.html'),
    listboxFieldMetadata: at('../tooling/conformance/listbox-field-metadata.html'),
    editorFieldMetadata: at('../tooling/conformance/editor-field-metadata.html'),
  });
});

it('builds the complete reacd site browser runtime independently of content', () => {
  expect(documentation.base).toBe('/');
  expect(documentation.publicDir).toBe(false);
  expect(documentation.build?.outDir).toBe('.cache/site-runtime-dist');
  expect(documentation.build?.rolldownOptions?.input).toBe(
    at('../tooling/site/runtime/client.tsx'),
  );
  expect(documentation.build?.rolldownOptions?.output).toMatchObject({
    entryFileNames: 'assets/site.js',
  });
});

it('inherits one SDK ownership group while keeping native adapters separate', () => {
  const output = documentation.build?.rolldownOptions?.output;
  if (!output || Array.isArray(output)) throw new Error('Expected site output.');
  const splitting = output.codeSplitting;
  if (!splitting || typeof splitting !== 'object')
    throw new Error('Expected explicit site chunk groups.');
  expect(splitting.includeDependenciesRecursively).toBe(false);
  const names = splitting.groups?.map(group => group.name);
  expect(names?.filter(name => name === 'material-ui')).toHaveLength(1);
  expect(names?.filter(name => name === 'material-charts')).toHaveLength(1);
  expect(names).toEqual(expect.arrayContaining(['mui', 'shadcn', 'react-runtime']));
});

it('keeps the single site stylesheet without renaming other native assets', () => {
  const output = documentation.build?.rolldownOptions?.output;
  if (!output || Array.isArray(output) || typeof output.assetFileNames !== 'function')
    throw new Error('Expected site asset naming function.');
  for (const names of [['tokens.css'], ['font.woff2', 'site.css']])
    expect(output.assetFileNames({
      type: 'asset', names, originalFileNames: [], source: '',
    })).toBe('assets/site.css');
  expect(output.assetFileNames({
    type: 'asset', names: ['font.woff2'], originalFileNames: [], source: '',
  })).toBe('assets/[name]-[hash][extname]');
});

it('preserves source execution order without SDK recursive dependency capture', () => {
  expect(shared.build?.rolldownOptions).toMatchObject({
    preserveEntrySignatures: false,
    output: {
      strictExecutionOrder: true,
      codeSplitting: { includeDependenciesRecursively: false },
    },
  });
});
