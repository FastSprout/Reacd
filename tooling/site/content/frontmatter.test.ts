import { expect, it } from 'vitest';
import { readFrontmatter } from './frontmatter.js';

it('validates content and preview metadata independently of a rendering theme', () => {
  expect(
    readFrontmatter(`---
title: Button
description: An action
reacd_preview: Button
---
# Button
`),
  ).toEqual({
    title: 'Button',
    description: 'An action',
    preview: { type: 'preview', component: 'Button' },
    content: '# Button\n',
  });
  expect(readFrontmatter('Plain text')).toEqual({ content: 'Plain text' });
  expect(readFrontmatter('---\nreacd_example: Counter\n---\nExample').preview).toEqual({
    type: 'preview',
    example: 'Counter',
  });
});

it.each([
  '---\nunknown: 1\n---\n',
  '---\nreacd_preview: Invented\n---\n',
  '---\nreacd_preview: Button\nreacd_example: Counter\n---\n',
  '---\ntemplate: <script>\n---\n',
  '---\ntemplate: preview.html\n---\n',
  '---\nreacd_preview_adapter: mui\n---\n',
  '---\nreacd_preview_height: -1\n---\n',
  '---\ntitle: Test',
])('rejects malformed or unsupported frontmatter %s', (source) => {
  expect(() => readFrontmatter(source)).toThrow();
});
