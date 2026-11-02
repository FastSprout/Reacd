import { expect, it, vi } from 'vitest';
import { emitSelectValue } from './select-change.js';
it('bridges scalar and multiple SDK values without leaking mismatched payloads', () => {
  const scalar = vi.fn<(value: string) => void>();
  const multi = vi.fn<(value: readonly string[]) => void>();
  const single = { label: 'Role', value: '', items: [], onValueChange: scalar };
  const multiple = {
    ...single,
    mode: 'multiple',
    value: [],
    onValueChange: multi,
  } as const;
  emitSelectValue(single, 'reader', false);
  emitSelectValue(single, ['reader'], false);
  emitSelectValue(single, 'editor', true);
  expect(scalar.mock.calls).toEqual([['reader']]);
  emitSelectValue(multiple, ['reader'], false);
  emitSelectValue(multiple, 'reader', false);
  expect(multi.mock.calls).toEqual([[['reader']]]);
});
