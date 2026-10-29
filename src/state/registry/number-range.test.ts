import { expect, it, vi } from 'vitest';
import { boundedNumberRangeSchema } from '../../schema/number-range/index.js';
import { success } from '../../../test-support/data-table.js';
import { createStateRegistry } from './state-registry.js';

const definitions = [
  {
    key: 'window',
    kind: 'numberRange',
    initial: { start: 10, end: 30 },
    access: 'readWrite',
  },
];

it('validates, freezes and atomically publishes ordered range state', () => {
  const registry = success(createStateRegistry(definitions));
  const other = success(createStateRegistry(definitions));
  const changed = vi.fn();
  const unsubscribe = success(registry.subscribe('window', changed));
  expect(Object.isFrozen(success(registry.read('window')).value)).toBe(true);
  expect(registry.update('window', { start: 20, end: 20 }).success).toBe(true);
  expect(changed).toHaveBeenCalledOnce();
  expect(success(other.read('window')).value).toEqual({ start: 10, end: 30 });
  for (const value of [
    { start: 40, end: 30 },
    { start: Number.NaN, end: 50 },
    { start: 10, end: Number.POSITIVE_INFINITY },
    { start: 10, end: 30, className: 'native' },
    20,
  ])
    expect(registry.update('window', value).success).toBe(false);
  expect(changed).toHaveBeenCalledOnce();
  expect(registry.reset().success).toBe(true);
  expect(success(registry.read('window')).value).toEqual({ start: 10, end: 30 });
  unsubscribe();
});

it('preserves readonly access and component range constraints', () => {
  const reader = success(
    createStateRegistry(definitions.map((item) => ({ ...item, access: 'read' }))),
  );
  expect(
    reader.bind(
      { state: 'window', mode: 'readWrite' },
      { kinds: ['numberRange'], mode: 'readWrite' },
    ).success,
  ).toBe(false);
  const binding = success(
    reader.bind(
      { state: 'window', mode: 'read' },
      { kinds: ['numberRange'], mode: 'read' },
    ),
  );
  expect('write' in binding).toBe(false);
  expect(reader.update('window', { start: 10, end: 20 }).success).toBe(true);
  const registry = success(createStateRegistry(definitions));
  const bounds = boundedNumberRangeSchema({ min: 5, max: 40 });
  const remove = success(
    registry.constrain(['window'], (read) => {
      const snapshot = read('window');
      if (!snapshot.success) return snapshot;
      return bounds.safeParse(snapshot.data.value).success
        ? { success: true, data: undefined }
        : { success: false, issues: [{ path: 'window', message: 'Outside range.' }] };
    }),
  );
  expect(registry.update('window', { start: 1, end: 35 }).success).toBe(false);
  expect(registry.update('window', { start: 10, end: 45 }).success).toBe(false);
  expect(registry.update('window', { start: 5, end: 40 }).success).toBe(true);
  remove();
});
