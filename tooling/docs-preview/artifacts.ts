import { cpSync, globSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { inspectBuiltReference, inspectReference } from './site.js';
import { referenceSlug } from './paths.js';
import { DOCS_PREVIEW_POLICY } from '../../src/core/docs-preview-policy.js';
import { BUNDLE_POLICY } from '../build/bundle-policy.js';

interface ReferenceEntry {
  name: string;
  source: string;
}
export function validateReferences(
  root: string,
  entries: readonly ReferenceEntry[],
  built: boolean,
): void {
  const issues = entries.flatMap((entry) => {
    const slug = referenceSlug(entry.name);
    const path = built
      ? `site/components/${slug}/index.html`
      : `docs/components/${slug}.md`;
    const content = readFileSync(join(root, path), 'utf8');
    const errors = built
      ? inspectBuiltReference(content, entry.name)
      : inspectReference(content, entry);
    return errors.map((error) => `${entry.name}: ${error}`);
  });
  if (issues.length)
    throw new Error(`Invalid documentation previews:\n${issues.join('\n')}`);
}

export function publishPreviewAssets(build: string, site: string): void {
  const html = join(build, 'docs-preview.html');
  const assets = join(build, 'assets');
  if (!statSync(html).isFile() || !statSync(assets).isDirectory()) {
    throw new Error('Compiled documentation preview artifacts are invalid.');
  }
  const scripts = globSync('**/*.js', { cwd: assets });
  if (
    scripts.length === 0 ||
    scripts.some(
      (file) => statSync(join(assets, file)).size > BUNDLE_POLICY.maxChunkBytes,
    )
  ) {
    throw new Error('Documentation preview violates the JavaScript bundle budget.');
  }
  const destination = join(site, 'assets/previews');
  mkdirSync(destination, { recursive: true });
  cpSync(html, join(destination, 'docs-preview.html'));
  cpSync(assets, join(destination, 'assets'), { recursive: true });
  for (const name of DOCS_PREVIEW_POLICY.publicAssets) {
    cpSync(join(build, name), join(site, name));
  }
}
