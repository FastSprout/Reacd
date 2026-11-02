import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { resolveBlocks, resolveDestination } from './links.js';
import { parseMarkdown } from './markdown.js';
import type { SitePage } from './model.js';

const page: SitePage = {
  sourcePath: 'guide.md',
  route: '/guide/',
  title: 'Guide',
  titleAnchor: 'guide',
  description: 'Guide',
  source: '# Guide',
  sections: [],
  headings: [{ id: 'details', level: 2, title: 'Details' }],
};
const pages = [page];
const roots: string[] = [];
it('validates absolute destinations on the configured canonical origin', async () => {
  const root = await fixture();
  expect(
    await resolveDestination(
      root,
      'guide.md',
      'https://reacd.dev/guide/#details',
      pages,
    ),
  ).toBe('/guide/#details');
  await expect(
    resolveDestination(root, 'guide.md', 'https://reacd.dev/missing/#missing', pages),
  ).rejects.toThrow();
  await expect(
    resolveDestination(
      root,
      'guide.md',
      'https://docs.example/guide/#missing',
      pages,
      'https://docs.example',
    ),
  ).rejects.toThrow();
  expect(
    await resolveDestination(
      root,
      'guide.md',
      'https://reacd.dev/guide/#missing',
      pages,
      'https://docs.example',
    ),
  ).toBe('https://reacd.dev/guide/#missing');
});
afterEach(async () => {
  await Promise.all(roots.map((root) => rm(root, { recursive: true, force: true })));
  roots.length = 0;
});
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'reacd-links-'));
  roots.push(root);
  await mkdir(join(root, 'assets'));
  await writeFile(join(root, 'assets/logo.svg'), '<svg/>');
  return root;
}

it('canonicalizes Markdown, route and asset targets and verifies anchors', async () => {
  const root = await fixture();
  for (const href of ['guide.md#details', '/guide/#details']) {
    expect(await resolveDestination(root, 'index.md', href, pages)).toBe(
      '/guide/#details',
    );
  }
  expect(await resolveDestination(root, 'guide.md', '#guide', pages)).toBe(
    '/guide/#guide',
  );
  expect(await resolveDestination(root, 'guide.md', '/assets/logo.svg', pages)).toBe(
    '/assets/logo.svg',
  );
  expect(
    await resolveDestination(root, 'nested/page.md', '../guide.md?q=a', pages),
  ).toBe('/guide/?q=a');
  for (const href of [
    'https://example.com',
    'http://example.com',
    'mailto:test@example.com',
    'tel:+48123456789',
  ]) {
    expect(await resolveDestination(root, 'guide.md', href, pages)).toBe(href);
  }
});

it.each([
  'javascript:alert(1)',
  'data:image/svg+xml,x',
  '//example.com',
  '../outside.md',
  '/missing/',
  'missing.md',
  '#missing',
  'assets/missing.svg',
  '%zz',
  'assets\\logo.svg',
])('rejects unsafe or broken destinations %s', async (href) => {
  const root = await fixture();
  await expect(resolveDestination(root, 'guide.md', href, pages)).rejects.toThrow();
});

it('resolves nested prose links and preserves code', async () => {
  const root = await fixture();
  const parsed = await parseMarkdown(`## Heading [Guide](guide.md)

**[Guide](guide.md)** and text, \`code\`.

![Logo](assets/logo.svg)

> [Guide](guide.md)

- [Guide](guide.md)

| Link | More |
| ---- | ---- |
| [Guide](guide.md) | [Details](guide.md#details) |

---

\`\`\`text
guide.md
\`\`\`
`);
  const sections = await Promise.all(
    parsed.sections.map(async (section) =>
      section.type === 'prose'
        ? resolveBlocks(root, page, pages, section.document)
        : [],
    ),
  );
  const source = JSON.stringify(sections);
  expect(source).toContain('"href":"/guide/"');
  expect(source).toContain('"src":"/assets/logo.svg"');
  expect(source).toContain('"content":"guide.md"');
});
