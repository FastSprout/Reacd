import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { publishPreviewAssets, validateReferences } from './artifacts.js';
import { referenceSlug } from './paths.js';
import { DOCS_PREVIEW_POLICY } from '../../src/core/docs-preview-policy.js';
import { BUNDLE_POLICY } from '../build/bundle-policy.js';
let directory = '';
afterEach(() => {
  if (directory) rmSync(directory, { recursive: true });
});
it('maps acronym and conventional names to reference paths', () => {
  expect(referenceSlug('PageCTA')).toBe('page-cta');
  expect(referenceSlug('HStack')).toBe('h-stack');
  expect(referenceSlug('TextArea')).toBe('text-area');
});
it('copies compiled preview assets only into the generated site', () => {
  directory = mkdtempSync(join(tmpdir(), 'reacd-docs-'));
  const build = join(directory, 'build');
  const site = join(directory, 'site');
  mkdirSync(join(build, 'assets'), { recursive: true });
  writeFileSync(join(build, 'docs-preview.html'), '<script src="./assets/a.js">');
  writeFileSync(join(build, 'assets/a.js'), 'compiled');
  for (const name of DOCS_PREVIEW_POLICY.publicAssets) {
    writeFileSync(join(build, name), `Local ${name}`);
  }
  publishPreviewAssets(build, site);
  expect(readFileSync(join(site, 'assets/previews/assets/a.js'), 'utf8')).toBe(
    'compiled',
  );
  expect(
    readFileSync(join(site, 'assets/previews/docs-preview.html'), 'utf8'),
  ).toContain('./assets/a.js');
  for (const name of DOCS_PREVIEW_POLICY.publicAssets) {
    expect(readFileSync(join(site, name), 'utf8')).toBe(`Local ${name}`);
  }
});
it('rejects a missing compiled preview or missing assets', () => {
  directory = mkdtempSync(join(tmpdir(), 'reacd-docs-'));
  expect(() => publishPreviewAssets(directory, join(directory, 'site'))).toThrow();
  writeFileSync(join(directory, 'docs-preview.html'), 'missing assets');
  expect(() => publishPreviewAssets(directory, join(directory, 'site'))).toThrow();
});
it('fails invalid source and built reference wiring', () => {
  directory = mkdtempSync(join(tmpdir(), 'reacd-docs-'));
  mkdirSync(join(directory, 'docs/components'), { recursive: true });
  mkdirSync(join(directory, 'site/components/button'), { recursive: true });
  writeFileSync(join(directory, 'docs/components/button.md'), 'No live preview');
  writeFileSync(join(directory, 'site/components/button/index.html'), 'No frame');
  const entries = [{ name: 'Button', source: 'examples/button.tsx' }];
  expect(() => validateReferences(directory, entries, false)).toThrow('Button');
  expect(() => validateReferences(directory, entries, true)).toThrow('Button');
  writeFileSync(
    join(directory, 'docs/components/button.md'),
    'template: preview.html\nreacd_preview: Button\n' +
      'reacd_preview_height: 560\n' +
      '<!-- reacd-live-preview -->\n--8<-- "examples/button.tsx"',
  );
  expect(() => validateReferences(directory, entries, false)).not.toThrow();
  writeFileSync(
    join(directory, 'site/components/button/index.html'),
    '<iframe title="Live Button example" ' +
      'src="docs-preview.html?component=Button"></iframe>' +
      '<code class="language-tsx">Actual runnable source</code>',
  );
  expect(() => validateReferences(directory, entries, true)).not.toThrow();
});

it('rejects a directory entry or a non-directory asset container', () => {
  directory = mkdtempSync(join(tmpdir(), 'reacd-docs-'));
  mkdirSync(join(directory, 'docs-preview.html'));
  expect(() => publishPreviewAssets(directory, join(directory, 'site'))).toThrow(
    'artifacts are invalid',
  );
  rmSync(join(directory, 'docs-preview.html'), { recursive: true });
  writeFileSync(join(directory, 'docs-preview.html'), 'compiled');
  writeFileSync(join(directory, 'assets'), 'not a directory');
  expect(() => publishPreviewAssets(directory, join(directory, 'site'))).toThrow(
    'artifacts are invalid',
  );
});

it('rejects empty or oversized compiled JavaScript without changing the budget', () => {
  directory = mkdtempSync(join(tmpdir(), 'reacd-docs-'));
  mkdirSync(join(directory, 'assets'));
  writeFileSync(join(directory, 'docs-preview.html'), 'compiled');
  expect(() => publishPreviewAssets(directory, join(directory, 'site'))).toThrow(
    'bundle budget',
  );
  writeFileSync(
    join(directory, 'assets/large.js'),
    Buffer.alloc(BUNDLE_POLICY.maxChunkBytes + 1),
  );
  expect(() => publishPreviewAssets(directory, join(directory, 'site'))).toThrow(
    'bundle budget',
  );
});
