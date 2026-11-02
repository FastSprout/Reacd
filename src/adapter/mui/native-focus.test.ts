import { expect, it, vi } from 'vitest';
import { focusMaterialField } from './native-focus.js';
it('uses the native SDK focus handle and ignores an unmounted handle', () => {
  const focus = vi.fn<() => void>();
  focusMaterialField({ focus });
  focusMaterialField(null);
  expect(focus).toHaveBeenCalledWith();
  expect(focus).toHaveBeenCalledTimes(1);
});
