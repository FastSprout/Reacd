import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { proseDocumentSchema } from '../../../src/schema/prose/prose.schema.js';
import { headingAnchor } from './blocks.js';
import { parseMarkdown } from './markdown.js';

it.each([
  ['⚠ BREAKING CHANGES', 'breaking-changes'],
  ['--- 安全な変更', '安全な変更'],
  ['🙂  ', 'section'],
  [' _Ready', '_ready'],
  ['2026 changes', '2026-changes'],
  ['Release-', 'release-'],
])('generates a valid stable anchor for %s', (title, expected) => {
  const id = headingAnchor(title, new Set());
  expect(id).toBe(expected);
  expect(proseDocumentSchema.safeParse([
    { type: 'heading', level: 2, id, children: [{ type: 'text', text: title }] },
  ]).success).toBe(true);
});

it('deduplicates normalized labels and fallback collisions', () => {
  const anchors = new Set<string>();
  expect(headingAnchor('⚠ BREAKING CHANGES', anchors)).toBe('breaking-changes');
  expect(headingAnchor('BREAKING CHANGES', anchors)).toBe('breaking-changes-1');
  expect(headingAnchor('Section', anchors)).toBe('section');
  expect(headingAnchor('🙂', anchors)).toBe('section-1');
  expect(headingAnchor('---', anchors)).toBe('section-2');
});

it('validates the actual generated release changelog as closed Prose', async () => {
  const source = readFileSync('docs/changelog.md', 'utf8');
  const parsed = await parseMarkdown(source);
  expect(parsed.headings.some((heading) => heading.id === 'breaking-changes'))
    .toBe(true);
  const documents = parsed.sections.flatMap((section) =>
    section.type === 'prose' ? [section.document] : [],
  );
  expect(documents.length).toBeGreaterThan(0);
  for (const document of documents) {
    expect(proseDocumentSchema.safeParse(document).success).toBe(true);
  }
});
