import { expect, it } from 'vitest';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { createEditorDragSession } from './drag-session.js';

const value = editorDocumentSchema.parse({
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'first', content: [] },
    { type: 'paragraph', id: 'second', content: [] },
  ],
});
function target() {
  const root = document.createElement('div');
  const node = document.createElement('p');
  node.setAttribute('data-reacd-block', 'second');
  root.append(node);
  return { root, node };
}

it('requires a local drag source and produces one immutable sibling reorder', () => {
  const session = createEditorDragSession();
  const { root, node } = target();
  expect(session.drop(value, node, 1, root)).toBeUndefined();
  expect(session.begin(value, 'unknown')).toBe(false);
  expect(session.begin(value, 'first')).toBe(true);
  const moved = session.drop(value, node, 1, root);
  expect(moved?.blocks.map((block) => block.id)).toEqual(['second', 'first']);
  expect(value.blocks[0]?.id).toBe('first');
  expect(session.drop(value, node, 1, root)).toBeUndefined();
  expect(session.begin(value, 'first')).toBe(true);
  session.cancel();
  expect(session.drop(value, node, 1, root)).toBeUndefined();
});

it('rejects foreign and stale targets and selects compatible nested containers', () => {
  const session = createEditorDragSession();
  const { root, node } = target();
  session.begin(value, 'first');
  expect(session.drop(value, null, 1, root)).toBeUndefined();
  session.begin(value, 'first');
  expect(session.drop(value, document.createElement('p'), 1, root)).toBeUndefined();
  session.begin(value, 'first');
  expect(session.drop(value, root, 1, root)).toBeUndefined();
  node.setAttribute('data-reacd-block', '');
  session.begin(value, 'first');
  expect(session.drop(value, node, 1, root)).toBeUndefined();
  node.setAttribute('data-reacd-block', 'stale');
  session.begin(value, 'first');
  expect(session.drop(value, node, 1, root)).toBeUndefined();
  const nested = editorDocumentSchema.parse({ version: 1, blocks: [
    { type: 'paragraph', id: 'first', content: [] },
    { type: 'quote', id: 'quote', children: [
      { type: 'paragraph', id: 'child', content: [] },
    ] },
  ] });
  const quote = document.createElement('blockquote');
  quote.setAttribute('data-reacd-block', 'quote');
  node.setAttribute('data-reacd-block', 'child');
  quote.append(node);
  root.append(quote);
  session.begin(nested, 'first');
  expect(session.drop(nested, node, 1, root)?.blocks.map((block) => block.id))
    .toEqual(['quote', 'first']);
  node.setAttribute('data-reacd-block', 'second');
  root.append(node);
  session.begin(value, 'first');
  expect(session.drop(value, node, -1, root)).toBe(value);
});
