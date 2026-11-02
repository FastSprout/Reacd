import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { includeSnippets, markdownFiles, publicFile } from './files.js';

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.map((root) => rm(root, { recursive: true, force: true })));
  roots.length = 0;
});
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'reacd-content-files-'));
  roots.push(root);
  await mkdir(join(root, 'examples'));
  await writeFile(join(root, 'index.md'), '# Start');
  await writeFile(join(root, 'examples/button.tsx'), 'Button\n');
  return root;
}

it('loads Markdown and expands indented public snippets', async () => {
  const root = await fixture();
  await writeFile(join(root, 'examples/index.md'), '# Examples');
  expect(await markdownFiles(root)).toEqual(['examples/index.md', 'index.md']);
  expect(
    await includeSnippets(root, '```tsx\n  --8<-- "examples/button.tsx"\n```'),
  ).toBe('```tsx\n  Button\n```');
});

it('rejects traversal, symlinks, tests, missing files and include cycles', async () => {
  const root = await fixture();
  await expect(publicFile(root, '.')).rejects.toThrow('escapes');
  await expect(publicFile(root, '..')).rejects.toThrow('escapes');
  await expect(publicFile(root, 'examples')).rejects.toThrow('must be a file');
  await expect(publicFile(join(root, 'examples'), '../index.md')).rejects.toThrow(
    'escapes',
  );
  await expect(includeSnippets(root, '--8<-- "missing.tsx"')).rejects.toThrow();
  await expect(includeSnippets(root, '--8<-- "examples/a.test.tsx"')).rejects.toThrow(
    'Invalid',
  );
  await expect(includeSnippets(root, '--8<-- "examples/a.css"')).rejects.toThrow(
    'Invalid',
  );
  await expect(includeSnippets(root, '--8<-- "examples/../index.md"')).rejects.toThrow(
    'Invalid',
  );
  await expect(includeSnippets(root, '--8<-- "/absolute.tsx"')).rejects.toThrow(
    'Invalid',
  );
  await writeFile(join(root, 'cycle.md'), '--8<-- "cycle.md"');
  await expect(includeSnippets(root, '--8<-- "cycle.md"')).rejects.toThrow('Cyclic');
  await symlink(join(root, 'index.md'), join(root, 'linked.md'));
  await expect(markdownFiles(root)).rejects.toThrow('Symbolic');
  await symlink(join(root, '..'), join(root, 'outside'));
  await expect(publicFile(root, 'outside')).rejects.toThrow('escapes');
});
