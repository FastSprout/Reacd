import { getSchema, generateText } from '@tiptap/core';
import { DOMParser, DOMSerializer } from '@tiptap/pm/model';
import { expect, it } from 'vitest';
import { createEditorExtensions } from './extensions.js';

it('renders owned block ids and inline atoms as escaped native content', () => {
  const extensions = createEditorExtensions();
  const schema = getSchema(extensions);
  const json = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        attrs: { reacdId: 'intro' },
        content: [
          { type: 'text', text: '<script>Plain text</script>' },
          { type: 'reacdMention', attrs: { id: 'person', label: 'Example person' } },
          { type: 'reacdEmoji', attrs: { name: 'wave', value: '👋' } },
        ],
      },
    ],
  };
  const node = schema.nodeFromJSON(json);
  node.check();
  const container = document.createElement('div');
  container.append(DOMSerializer.fromSchema(schema).serializeFragment(node.content));
  expect(container.querySelector('[data-reacd-block="intro"]')).not.toBeNull();
  expect(container.querySelector('script')).toBeNull();
  expect(
    DOMParser.fromSchema(schema).parse(container).firstChild?.attrs['reacdId'],
  ).toBe('intro');
  expect(container.textContent).toBe('<script>Plain text</script>@Example person👋');
  expect(container.querySelector('[role="img"]')).toHaveAttribute('aria-label', 'wave');
  expect(generateText(json, extensions)).toBe(
    '<script>Plain text</script>@Example person👋',
  );
});

it('keeps extension instances private per editor and malformed atoms honest', () => {
  const first = createEditorExtensions();
  const second = createEditorExtensions();
  expect(first[0]).not.toBe(second[0]);
  const schema = getSchema(first);
  const json = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'reacdMention', attrs: { id: null, label: null } },
          { type: 'reacdEmoji', attrs: { name: null, value: null } },
        ],
      },
    ],
  };
  const node = schema.nodeFromJSON(json);
  const container = document.createElement('div');
  container.append(DOMSerializer.fromSchema(schema).serializeFragment(node.content));
  expect(container.querySelector('[data-reacd-block]')).toBeNull();
  expect(container.textContent).toBe(
    'Unavailable editor content.Unavailable editor content.',
  );
  expect(generateText(json, first)).toBe(
    'Unavailable editor content.Unavailable editor content.',
  );
});
