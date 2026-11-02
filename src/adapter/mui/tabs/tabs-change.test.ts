import { expect, it, vi } from 'vitest';
import { emitTabValue } from './tabs-change.js';
it('accepts only declared string values from the SDK value bridge', () => {
  const change = vi.fn<(value: string) => void>();
  emitTabValue(change, 'overview');
  emitTabValue(change, 12);
  expect(change.mock.calls).toEqual([['overview']]);
});
