import { describe, expect, it } from 'vitest';
import { createStateRegistry } from './state-registry.js';
import type { Result } from '../../core/result.js';

function value<T>(result: Result<T>): T {
  if (!result.success) throw new Error(JSON.stringify(result.issues));
  return result.data;
}

const definitions = [
  { key: 'filter', kind: 'text', initial: '', access: 'readWrite' },
  {
    key: 'page',
    kind: 'pagination',
    initial: { pageIndex: 3, pageSize: 25 },
    access: 'readWrite',
  },
];

describe('atomic generative state transactions', () => {
  it('publishes the complete transaction before notifying subscribers', () => {
    const registry = value(createStateRegistry(definitions));
    const observations: unknown[] = [];
    const unsubscribe = value(
      registry.subscribe('filter', () => {
        observations.push(value(registry.read('page')).value);
      }),
    );
    expect(
      value(
        registry.transaction([
          { key: 'filter', value: 'Example' },
          { key: 'page', value: { pageIndex: 0, pageSize: 25 } },
        ]),
      ),
    ).toHaveLength(2);
    expect(observations).toEqual([{ pageIndex: 0, pageSize: 25 }]);
    unsubscribe();
  });

  it('rejects invalid values, unknown keys, and duplicate updates atomically', () => {
    const registry = value(createStateRegistry(definitions));
    for (const updates of [
      [
        { key: 'filter', value: 'Wrong batch' },
        { key: 'page', value: { pageIndex: -1, pageSize: 25 } },
      ],
      [
        { key: 'filter', value: 'Wrong batch' },
        { key: 'missing', value: 1 },
      ],
      [
        { key: 'filter', value: 'First' },
        { key: 'filter', value: 'Second' },
      ],
    ]) {
      expect(registry.transaction(updates).success).toBe(false);
      expect(value(registry.read('filter')).value).toBe('');
      expect(value(registry.read('page')).value).toEqual({
        pageIndex: 3,
        pageSize: 25,
      });
    }
    expect(registry.update('filter', 42).success).toBe(false);
    expect(value(registry.transaction([]))).toEqual([]);
  });
});
