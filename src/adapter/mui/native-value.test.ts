import { expect, it, vi } from 'vitest';
import { emitNativeValue } from './native-value.js';
it('bridges a value-only callback and rejects blocked SDK changes', () => {
  const change = vi.fn<(value: string) => void>();
  emitNativeValue(change, 'accepted', false);
  emitNativeValue(change, 'blocked', true);
  expect(change.mock.calls).toEqual([['accepted']]);
});

it('does not emit an optional unbound transition', () => {
  expect(() => emitNativeValue(undefined, 'ignored', false)).not.toThrow();
});
