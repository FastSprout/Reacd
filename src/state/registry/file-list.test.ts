import { expect, it, vi } from 'vitest';
import { success } from '../../../test-support/data-table.js';
import { createStateRegistry } from './state-registry.js';

const file = {
  id: 'one',
  name: 'note.txt',
  mediaType: 'text/plain',
  size: 3,
  lastModified: 0,
  content: { encoding: 'base64', data: 'YWJj' },
};
const definitions = [
  { key: 'files', kind: 'fileList', access: 'readWrite', initial: [] },
];

it('publishes real file bytes as independent immutable application state', () => {
  const registry = success(createStateRegistry(definitions));
  const other = success(createStateRegistry(definitions));
  const changed = vi.fn();
  const unsubscribe = success(registry.subscribe('files', changed));
  const mutable = { ...file, content: { ...file.content } };
  expect(registry.update('files', [mutable]).success).toBe(true);
  const snapshot = success(registry.read('files'));
  if (snapshot.kind !== 'fileList') throw new Error('Wrong file state kind.');
  expect(snapshot.value).toEqual([file]);
  expect(Object.isFrozen(snapshot.value)).toBe(true);
  expect(Object.isFrozen(snapshot.value[0])).toBe(true);
  mutable.name = 'changed.txt';
  expect(success(registry.read('files')).value).toEqual([file]);
  expect(success(other.read('files')).value).toEqual([]);
  expect(changed).toHaveBeenCalledOnce();
  expect(registry.reset().success).toBe(true);
  expect(success(registry.read('files')).value).toEqual([]);
  unsubscribe();
});

it('protects readers and rejects malformed byte payloads atomically', () => {
  const registry = success(createStateRegistry(definitions));
  for (const invalid of [
    [{ ...file, size: 2 }],
    [{ ...file, content: { encoding: 'base64', data: 'YR==' }, size: 1 }],
    [{ ...file, mediaType: 'text/plain\n' }],
    [{ ...file, path: '/private/note.txt' }],
    [new File(['abc'], 'note.txt')],
  ]) {
    expect(registry.update('files', invalid).success).toBe(false);
    expect(success(registry.read('files')).value).toEqual([]);
  }
  const reader = success(createStateRegistry([{ ...definitions[0], access: 'read' }]));
  expect(
    reader.bind(
      { state: 'files', mode: 'readWrite' },
      {
        kinds: ['fileList'],
        mode: 'readWrite',
      },
    ).success,
  ).toBe(false);
  const binding = success(
    reader.bind(
      { state: 'files', mode: 'read' },
      {
        kinds: ['fileList'],
        mode: 'read',
      },
    ),
  );
  expect('write' in binding).toBe(false);
});
