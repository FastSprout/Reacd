import { expect, it, vi } from 'vitest';
import { requestSelectMenuValue } from './select-menu-value.js';

const items = [{ value: 'a', label: 'Alpha' }];
const base = { label: 'Owner', items, value: 'a', onValueChange: vi.fn() };
const request = <Value>(
  callback: ((value: Value) => boolean | void) | undefined,
  value: Value,
) => callback?.(value) !== false;

it('maps SDK empty sentinels and canonical values before form notification', () => {
  const accepted = vi.fn();
  expect(requestSelectMenuValue(base, null, false, request, accepted)).toBe(true);
  expect(base.onValueChange).toHaveBeenCalledWith('');
  expect(accepted).toHaveBeenCalledWith('');
  expect(requestSelectMenuValue(base, 'a', true, request)).toBe(false);
  expect(
    requestSelectMenuValue(
      { ...base, onValueChange: () => false },
      'a',
      false,
      request,
    ),
  ).toBe(false);
});

it('preserves whole-array ordering and blocks vetoed multiple requests', () => {
  const change = vi.fn();
  expect(
    requestSelectMenuValue(
      { ...base, mode: 'multiple', value: [], onValueChange: change },
      ['a'],
      false,
      request,
    ),
  ).toBe(true);
  expect(change).toHaveBeenCalledWith(['a']);
  expect(
    requestSelectMenuValue(
      { ...base, mode: 'multiple', value: [], onValueChange: () => false },
      [],
      false,
      request,
    ),
  ).toBe(false);
});
