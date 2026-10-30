import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import shared from '../vite.config.js';
import conformance from '../vite.conformance.config.js';
import documentation from '../vite.docs.config.js';

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
  expect(conformance.publicDir).toBe(at('../tooling/docs-preview/public'));
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

it('builds documentation from its own trusted host with a stable HTML basename', () => {
  expect(documentation.root).toBe(at('../tooling/docs-preview'));
  expect(documentation.base).toBe('./');
  expect(documentation.publicDir).toBe(at('../tooling/docs-preview/public'));
  expect(documentation.build?.outDir).toBe(at('../.cache/docs-preview-dist'));
  expect(documentation.build?.rolldownOptions?.input).toBe(
    at('../tooling/docs-preview/docs-preview.html'),
  );
});
