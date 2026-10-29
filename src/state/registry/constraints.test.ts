import { describe, expect, it, vi } from 'vitest';
import type { Result } from '../../core/result.js';
import { createStateRegistry } from './state-registry.js';
import type { StateConstraint } from './registry.types.js';

function value<T>(result: Result<T>): T {
  if (!result.success) throw new Error(JSON.stringify(result.issues));
  return result.data;
}

const definitions = [
  { key: 'amount', kind: 'number', initial: 5, access: 'readWrite' },
  { key: 'maximum', kind: 'number', initial: 10, access: 'readWrite' },
  { key: 'name', kind: 'text', initial: '', access: 'readWrite' },
];

describe('registered state invariants', () => {
  it('checks a complete staged snapshot before committing any state', () => {
    const registry = value(createStateRegistry(definitions));
    const constraint = vi.fn<StateConstraint>((read) => {
      const amount = value(read('amount'));
      const maximum = value(read('maximum'));
      expect(read('optional').success).toBe(false);
      if (amount.kind !== 'number' || maximum.kind !== 'number') {
        throw new Error('Expected numeric states');
      }
      return amount.value <= maximum.value
        ? { success: true, data: undefined }
        : { success: false, issues: [{ path: 'amount', message: 'Above maximum.' }] };
    });
    const remove = value(registry.constrain(['amount', 'maximum'], constraint));
    expect(registry.update('amount', 20).success).toBe(false);
    expect(value(registry.read('amount')).value).toBe(5);
    value(
      registry.transaction([
        { key: 'amount', value: 20 },
        { key: 'maximum', value: 30 },
      ]),
    );
    expect(value(registry.read('amount')).value).toBe(20);
    const calls = constraint.mock.calls.length;
    value(registry.update('name', 'Unrelated'));
    expect(constraint).toHaveBeenCalledTimes(calls);
    remove();
    value(registry.update('amount', 100));
  });

  it('rejects invalid registration and converts thrown validation failures', () => {
    const registry = value(createStateRegistry(definitions));
    expect(
      registry.constrain([], () => ({ success: true, data: undefined })).success,
    ).toBe(false);
    expect(
      registry.constrain(['missing'], () => ({ success: true, data: undefined }))
        .success,
    ).toBe(false);
    for (const failure of [new Error('Rejected'), 'Unknown failure']) {
      expect(
        registry.constrain(['amount'], () => {
          throw failure;
        }).success,
      ).toBe(false);
    }
  });
});
