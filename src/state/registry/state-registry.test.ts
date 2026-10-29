import { describe, expect, it, vi } from 'vitest';
import { createReacdStore } from '../store.js';
import { createStateRegistry } from './state-registry.js';
import type { Result } from '../../core/result.js';

function value<T>(result: Result<T>): T {
  if (!result.success) throw new Error(JSON.stringify(result.issues));
  return result.data;
}

const definitions = [
  { key: 'customer.name', kind: 'text', initial: 'Initial', access: 'readWrite' },
  { key: 'amount', kind: 'number', initial: 1, access: 'readWrite' },
  { key: 'enabled', kind: 'boolean', initial: false, access: 'readWrite' },
  { key: 'rows', kind: 'tableRows', initial: [], access: 'read' },
  { key: 'selected', kind: 'selection', initial: [], access: 'readWrite' },
  { key: 'sort', kind: 'sorting', initial: [], access: 'readWrite' },
  { key: 'filters', kind: 'filters', initial: [], access: 'readWrite' },
  {
    key: 'page',
    kind: 'pagination',
    initial: { pageIndex: 0, pageSize: 25 },
    access: 'readWrite',
  },
];

describe('scoped generative state registry', () => {
  it('creates typed snapshots for every state kind', () => {
    const registry = value(createStateRegistry(definitions));
    expect(registry.keys).toEqual(definitions.map((item) => item.key));
    for (const definition of definitions) {
      expect(value(registry.read(definition.key))).toEqual({
        key: definition.key,
        kind: definition.kind,
        value: definition.initial,
      });
    }
    const snapshot = value(registry.read('customer.name'));
    expect(Object.isFrozen(snapshot)).toBe(true);
  });

  it('updates all value kinds through the validated host API', () => {
    const registry = value(createStateRegistry(definitions));
    const updates = [
      { key: 'customer.name', value: 'Edited' },
      { key: 'amount', value: 2 },
      { key: 'enabled', value: true },
      { key: 'rows', value: [{ id: 'row-1', cells: { name: 'Example' } }] },
      { key: 'selected', value: ['row-1'] },
      { key: 'sort', value: [{ column: 'name', direction: 'ascending' }] },
      { key: 'filters', value: [{ column: 'name', operator: 'equals', value: 'A' }] },
      { key: 'page', value: { pageIndex: 1, pageSize: 10 } },
    ];
    for (const update of updates) {
      expect(value(registry.update(update.key, update.value)).value).toEqual(
        update.value,
      );
    }
    value(registry.reset());
    expect(value(registry.read('customer.name')).value).toBe('Initial');
    expect(value(registry.read('rows')).value).toEqual([]);
  });

  it('isolates registries, explicit stores, and literal dotted keys', () => {
    const first = value(createStateRegistry(definitions, createReacdStore()));
    const second = value(createStateRegistry(definitions));
    value(first.update('customer.name', 'Only first'));
    expect(value(second.read('customer.name')).value).toBe('Initial');
    expect(first.read('customer').success).toBe(false);
    expect(value(createStateRegistry([])).keys).toEqual([]);
    const prototype = value(
      createStateRegistry([
        { key: 'constructor', kind: 'text', initial: 'Safe', access: 'read' },
      ]),
    );
    expect(value(prototype.read('constructor')).value).toBe('Safe');
  });

  it('notifies subscribers with snapshots and removes subscriptions', () => {
    const registry = value(createStateRegistry(definitions));
    const listener = vi.fn();
    const unsubscribe = value(registry.subscribe('customer.name', listener));
    value(registry.update('customer.name', 'Edited'));
    expect(listener).toHaveBeenCalledWith({
      key: 'customer.name',
      kind: 'text',
      value: 'Edited',
    });
    unsubscribe();
    value(registry.update('customer.name', 'After unsubscribe'));
    expect(listener).toHaveBeenCalledOnce();
  });

  it('rejects unknown keys and invalid definitions without creating state', () => {
    const registry = value(createStateRegistry(definitions));
    expect(registry.read('missing').success).toBe(false);
    expect(registry.update('missing', 1).success).toBe(false);
    expect(registry.subscribe('missing', () => undefined).success).toBe(false);
    expect(createStateRegistry([definitions[0], definitions[0]]).success).toBe(false);
    expect(createStateRegistry({}).success).toBe(false);
  });
});
