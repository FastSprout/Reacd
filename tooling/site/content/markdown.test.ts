import { expect, it } from 'vitest';
import { parseMarkdown } from './markdown.js';

it('converts GFM content and previews into closed nodes', async () => {
  const result = await parseMarkdown(
    `# Button

## Usage *today*
**Strong** and ~~old~~, [link][guide], \`inline\`, two${'  '}
lines.

![Logo](logo.svg "Identity")

> A quotation

- [x] Checked
- [ ] Pending

3. Ordered

| Name | Value |
| ---- | ----- |
| A | B |

---

<!-- reacd-live-preview -->

\`\`\`tsx
const value = <Button label="Save" />;
\`\`\`

[guide]: guide.md
`,
    { type: 'preview', component: 'Button' },
  );
  expect(result.title).toBe('Button');
  expect(result.headings).toEqual([
    { id: 'usage-today', level: 2, title: 'Usage today' },
  ]);
  expect(result.sections.map((part) => part.type)).toEqual([
    'prose',
    'preview',
    'prose',
  ]);
  expect(JSON.stringify(result)).not.toContain('reacd-live-preview');
  expect(JSON.stringify(result)).toContain('"checked":true');
  expect(JSON.stringify(result)).toContain('"light":"#');
});

it('deduplicates heading IDs and retains raw code rather than HTML', async () => {
  const result = await parseMarkdown('## Repeat\n## Repeat\n```sh\nnpm install x\n```');
  expect(result.headings.map((heading) => heading.id)).toEqual(['repeat', 'repeat-1']);
  expect(result.title).toBeUndefined();
  expect(JSON.stringify(result)).toContain('npm install x');
});

it('rejects repeated preview markers and duplicate reference definitions', async () => {
  await expect(
    parseMarkdown('<!-- reacd-live-preview -->\n\n' + '<!-- reacd-live-preview -->', {
      type: 'preview',
      example: 'Counter',
    }),
  ).rejects.toThrow('unique');
  await expect(parseMarkdown('[a]: one.md\n[a]: two.md')).rejects.toThrow('Duplicate');
});

it.each([
  '<script>alert(1)</script>',
  '<!-- unknown -->',
  '<!-- reacd-live-preview -->',
  'Text ![inline](image.svg) more',
  'Footnote[^id]\n\n[^id]: Unsupported footnote',
  '```invented-language\nexecute()\n```',
])('rejects content outside the closed document contract %s', async (source) => {
  await expect(parseMarkdown(source)).rejects.toThrow();
});
