import { expect, it } from 'vitest';
import { editorMentionMenuNodeSchema } from './generative.schema.js';
import { editorMentionMenuSchema } from './editor-mention-menu.schema.js';

it('requires canonical unique mention ids and labels without source callbacks', () => {
  expect(
    editorMentionMenuSchema.safeParse({
      label: 'People',
      items: [{ id: 'person', label: 'Example person' }],
    }).success,
  ).toBe(true);
  for (const items of [
    [{ id: 'invalid id', label: 'Person' }],
    [
      { id: 'person', label: 'One' },
      { id: 'person', label: 'Two' },
    ],
    [{ id: 'person', label: 'Person', html: '<img>' }],
  ])
    expect(editorMentionMenuSchema.safeParse({ label: 'People', items }).success).toBe(
      false,
    );
});

it('accepts correlated host lookup mode and forbids mixing local catalogs or transport',
  () => {
    const remote = { label: 'People', results: null, onQueryChange: () => undefined };
    expect(editorMentionMenuSchema.safeParse(remote).success).toBe(true);
    expect(editorMentionMenuSchema.safeParse({ ...remote, results: {
      key: 'scope:1', query: 'a', status: 'ready',
      items: [{ id: 'person', label: 'Authoritative fuzzy match' }],
    } }).success).toBe(true);
    for (const properties of [
      { ...remote, items: [] }, { ...remote, onQueryChange: null },
      { label: 'People', results: null },
      { label: 'People', items: [], onQueryChange: () => undefined },
    ]) expect(editorMentionMenuSchema.safeParse(properties).success).toBe(false);
    expect(editorMentionMenuNodeSchema.safeParse({ type: 'EditorMentionMenu',
      ...remote }).success).toBe(false);
  });
