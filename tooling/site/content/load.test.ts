import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { loadSite } from './load.js';

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.map((root) => rm(root, { recursive: true, force: true })));
  roots.length = 0;
});
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'reacd-site-content-'));
  roots.push(root);
  await mkdir(join(root, 'docs/examples'), { recursive: true });
  await writeFile(
    join(root, 'site.config.yml'),
    `title: reacd
description: Component-only interfaces
origin: https://reacd.dev/
navigation:
  - Start: index.md
  - Guide: guide.md
`,
  );
  await writeFile(
    join(root, 'docs/index.md'),
    `---
title: Welcome
description: An introduction
---
# Welcome

[Guide](guide.md#usage)
`,
  );
  await writeFile(
    join(root, 'docs/guide.md'),
    `---
reacd_preview: Button
---
# Guide

## Usage

<!-- reacd-live-preview -->

\`\`\`tsx
--8<-- "examples/button.tsx"
\`\`\`
`,
  );
  await writeFile(join(root, 'docs/examples/button.tsx'), 'const value = 1;');
  return root;
}

it('loads stable pages, resolves references and strips the first h1', async () => {
  const root = await fixture();
  const manifest = await loadSite(root);
  expect(manifest).toEqual(await loadSite(root));
  expect(manifest.pages.map((page) => page.route)).toEqual(['/guide/', '/']);
  const start = manifest.pages.find((page) => page.route === '/');
  expect(start?.title).toBe('Welcome');
  expect(start?.description).toBe('An introduction');
  expect(JSON.stringify(start?.sections)).toContain('/guide/#usage');
  expect(JSON.stringify(manifest.pages)).toContain('const');
  expect(manifest.pages.every((page) => page.titleAnchor.length > 0)).toBe(true);
});

it('rejects unresolvable navigation and duplicate public routes', async () => {
  const root = await fixture();
  await rm(join(root, 'docs/guide.md'));
  await expect(loadSite(root)).rejects.toThrow();
  await writeFile(join(root, 'docs/guide.md'), '# Guide');
  await mkdir(join(root, 'docs/guide'));
  await writeFile(join(root, 'docs/guide/index.md'), '# Duplicate');
  await expect(loadSite(root)).rejects.toThrow('Duplicate documentation route');
});

it('uses site metadata when Markdown has no title', async () => {
  const root = await fixture();
  await writeFile(join(root, 'docs/index.md'), 'Introduction');
  await writeFile(join(root, 'docs/guide.md'), 'No title');
  const manifest = await loadSite(root);
  expect(manifest.pages[0]?.title).toBe('guide');
  expect(manifest.pages[0]?.description).toBe('Component-only interfaces');
});

it('rejects duplicate and unresolved navigation', async () => {
  const root = await fixture();
  await writeFile(
    join(root, 'site.config.yml'),
    `title: reacd
description: Component-only interfaces
origin: https://reacd.dev/
navigation:
  - Start: index.md
  - Again: index.md
`,
  );
  await expect(loadSite(root)).rejects.toThrow('Duplicate navigation key');
  await writeFile(
    join(root, 'site.config.yml'),
    `title: reacd
description: Component-only interfaces
origin: https://reacd.dev/
navigation:
  - Nested:
      - Missing: absent.md
`,
  );
  await expect(loadSite(root)).rejects.toThrow('unknown page');
});
