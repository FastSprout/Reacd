import { expect, it } from 'vitest';
import { inspectReference, inspectBuiltReference } from './site.js';
const entry = { name: 'Button', source: 'examples/button.tsx' };
const source = [
  '---',
  'template: preview.html',
  'reacd_preview: Button',
  'reacd_preview_height: 560',
  '---',
  '<!-- reacd-live-preview -->',
  '```tsx',
  '--8<-- "examples/button.tsx"',
  '```',
].join('\n');
it('requires the actual source, owned marker and trusted template', () => {
  expect(inspectReference(source, entry)).toEqual([]);
  for (const part of [
    'template: preview.html',
    'reacd_preview: Button',
    'reacd_preview_height: 560',
    '<!-- reacd-live-preview -->',
    '--8<-- "examples/button.tsx"',
  ]) {
    expect(inspectReference(source.replace(part, ''), entry)).not.toEqual([]);
  }
});
it('requires a built, named live frame and the compiled source', () => {
  const html =
    '<iframe title="Live Button example" ' +
    'src="../../assets/previews/docs-preview.html?component=Button"></iframe>' +
    '<code class="language-tsx">export function ButtonExample() {}</code>';
  expect(inspectBuiltReference(html, 'Button')).toEqual([]);
  expect(inspectBuiltReference('', 'Button')).toHaveLength(3);
});
