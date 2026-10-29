import { describe, expect, expectTypeOf, it } from 'vitest';
import { createStateRegistry } from './state-registry.js';
import type { Result } from '../../core/result.js';

function value<T>(result: Result<T>): T {
  if (!result.success) throw new Error(JSON.stringify(result.issues));
  return result.data;
}

const definitions = [
  { key: 'name', kind: 'text', initial: 'Initial', access: 'readWrite' },
  { key: 'dataset', kind: 'tableRows', initial: [], access: 'read' },
];

describe('read and read/write state bindings', () => {
  it('synchronizes several readers and writers without exposing writable atoms', () => {
    const registry = value(createStateRegistry(definitions));
    const first = value(
      registry.bind(
        { state: 'name', mode: 'readWrite' },
        { kinds: ['text'], mode: 'readWrite' },
      ),
    );
    const second = value(
      registry.bind(
        { state: 'name', mode: 'readWrite' },
        { kinds: ['text'], mode: 'readWrite' },
      ),
    );
    const display = value(
      registry.bind(
        { state: 'name', mode: 'read' },
        { kinds: ['text', 'number'], mode: 'read' },
      ),
    );
    expect(first.atom).toBe(second.atom);
    expect(first.atom).toBe(display.atom);
    expect('write' in display).toBe(false);
    expect('write' in first.atom).toBe(false);
    if (first.mode !== 'readWrite' || second.mode !== 'readWrite') {
      throw new Error('Expected writable bindings');
    }
    value(first.write('First edit'));
    expect(display.read().value).toBe('First edit');
    value(second.write('Second edit'));
    expect(first.read().value).toBe('Second edit');
    expect(registry.store.get(display.atom).value).toBe('Second edit');
    expect(first.write(42).success).toBe(false);
    expect(display.read().value).toBe('Second edit');
    if (display.mode === 'read') {
      expectTypeOf<Extract<'write', keyof typeof display>>().toBeNever();
    }
  });

  it('rejects unknown keys, wrong kinds, modes, and forbidden writes', () => {
    const registry = value(createStateRegistry(definitions));
    expect(registry.bind({}, { kinds: ['text'], mode: 'read' }).success).toBe(false);
    expect(
      registry.bind(
        { state: 'missing', mode: 'read' },
        { kinds: ['text'], mode: 'read' },
      ).success,
    ).toBe(false);
    expect(
      registry.bind(
        { state: 'name', mode: 'read' },
        { kinds: ['number'], mode: 'read' },
      ).success,
    ).toBe(false);
    expect(
      registry.bind(
        { state: 'name', mode: 'readWrite' },
        { kinds: ['text'], mode: 'read' },
      ).success,
    ).toBe(false);
    expect(
      registry.bind(
        { state: 'dataset', mode: 'readWrite' },
        { kinds: ['tableRows'], mode: 'readWrite' },
      ).success,
    ).toBe(false);
    value(registry.update('dataset', [{ id: 'row-1', cells: { name: 'Host data' } }]));
    expect(value(registry.read('dataset')).value).toEqual([
      { id: 'row-1', cells: { name: 'Host data' } },
    ]);
  });
});
