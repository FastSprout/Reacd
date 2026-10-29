import { describe, expect, it, vi } from 'vitest';
import { createEscapeScope } from './escape-scope.js';

describe('private overlay Escape scope', () => {
  it('dismisses the most recent active layer and releases leases independently', () => {
    const scope = createEscapeScope();
    const first = vi.fn();
    const second = vi.fn();
    expect(scope.dismiss()).toBe(false);
    const removeFirst = scope.register(first);
    const removeSecond = scope.register(second);
    expect(scope.dismiss()).toBe(true);
    expect(second).toHaveBeenCalledOnce();
    expect(first).not.toHaveBeenCalled();
    removeFirst();
    expect(scope.dismiss()).toBe(true);
    expect(second).toHaveBeenCalledTimes(2);
    removeSecond();
    removeSecond();
    expect(scope.dismiss()).toBe(false);
    expect(createEscapeScope().dismiss()).toBe(false);
  });
});
