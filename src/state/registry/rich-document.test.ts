import { expect, it, vi } from 'vitest';
import { success } from '../../../test-support/data-table.js';
import { createStateRegistry } from './state-registry.js';

const initial = {
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'intro', content: [{ type: 'text', text: 'Draft' }] },
  ],
};
const definitions = [
  { key: 'document', kind: 'richDocument', access: 'readWrite', initial },
];

it('publishes only validated rich documents and isolates application stores', () => {
  const first = success(createStateRegistry(definitions));
  const other = success(createStateRegistry(definitions));
  const notify = vi.fn();
  const unsubscribe = success(first.subscribe('document', notify));
  const next = {
    version: 1,
    blocks: [{ type: 'heading', id: 'title', level: 2, content: [] }],
  };
  expect(first.update('document', next).success).toBe(true);
  expect(success(first.read('document')).value).toEqual(next);
  expect(success(other.read('document')).value).toEqual(initial);
  expect(notify).toHaveBeenCalledOnce();
  for (const invalid of [
    { version: 1, blocks: [] },
    { ...initial, html: '<div>Injected</div>' },
    { version: 1, blocks: [{ type: 'image', id: 'external', src: '/image.svg' }] },
    '<p>HTML</p>',
  ])
    expect(first.update('document', invalid).success).toBe(false);
  expect(notify).toHaveBeenCalledOnce();
  expect(first.reset().success).toBe(true);
  expect(success(first.read('document')).value).toEqual(initial);
  unsubscribe();
});

it('protects read bindings and rejects hostile initial document graphs', () => {
  const reader = success(createStateRegistry([{ ...definitions[0], access: 'read' }]));
  expect(
    reader.bind(
      { state: 'document', mode: 'readWrite' },
      {
        kinds: ['richDocument'],
        mode: 'readWrite',
      },
    ).success,
  ).toBe(false);
  const bound = success(
    reader.bind(
      { state: 'document', mode: 'read' },
      {
        kinds: ['richDocument'],
        mode: 'read',
      },
    ),
  );
  expect('write' in bound).toBe(false);
  const cyclic: { blocks: unknown[]; version: number } = { version: 1, blocks: [] };
  cyclic.blocks.push(cyclic);
  expect(createStateRegistry([{ ...definitions[0], initial: cyclic }]).success).toBe(
    false,
  );
});
