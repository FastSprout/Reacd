import { expect, it, vi } from 'vitest';
import { followHref } from './native-navigation.js';

it('follows the captured destination with normal browser history', () => {
  const location = globalThis.location;
  const assign = vi.fn();
  vi.stubGlobal('location', { assign });
  try {
    followHref('/orders?page=2');
    expect(assign).toHaveBeenCalledExactlyOnceWith('/orders?page=2');
  } finally {
    vi.stubGlobal('location', location);
  }
});
