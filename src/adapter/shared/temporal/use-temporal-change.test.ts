import { act, renderHook } from '../../../../test-support/adapter-testing.js';
import { expect, it, vi } from 'vitest';
import { boundedDateValueSchema } from '../../../schema/date-time/index.js';
import { useTemporalChange } from './use-temporal-change.js';

it('guards canonical date requests, protection and rejection feedback', () => {
  const change = vi.fn();
  const schema = boundedDateValueSchema({ min: '2024-01-01', max: '2024-12-31' });
  const { result, rerender } = renderHook(
    ({ disabled, readOnly }) =>
      useTemporalChange<string | null>(
        (value) => schema.safeParse(value).success,
        change,
        'Invalid date',
        { disabled, readOnly },
      ),
    { initialProps: { disabled: false, readOnly: false } },
  );
  act(() => result.current.change('2024-02-30'));
  expect(change).not.toHaveBeenCalled();
  expect(result.current.error).toBe('Invalid date');
  act(() => result.current.change('2024-02-29'));
  expect(change).toHaveBeenLastCalledWith('2024-02-29');
  expect(result.current.error).toBeUndefined();
  rerender({ disabled: true, readOnly: false });
  act(() => result.current.change(null));
  rerender({ disabled: false, readOnly: true });
  act(() => result.current.change(null));
  expect(change).toHaveBeenCalledOnce();
});

it('recovers only for a changed valid controlled basis, without writing', () => {
  const write = vi.fn();
  const { result, rerender } = renderHook(
    ({ key, value }) =>
      useTemporalChange(
        (next: number) => next >= 0,
        write,
        'Invalid',
        {},
        { key, value },
      ),
    { initialProps: { key: 'original', value: 1 } },
  );
  act(() => result.current.change(-1));
  expect(result.current.error).toBe('Invalid');
  rerender({ key: 'original', value: 1 });
  expect(result.current.error).toBe('Invalid');
  rerender({ key: 'invalid-replacement', value: -1 });
  expect(result.current.error).toBe('Invalid');
  rerender({ key: 'valid-replacement', value: 2 });
  expect(result.current.error).toBeUndefined();
  rerender({ key: 'original', value: 1 });
  expect(result.current.error).toBeUndefined();
  expect(write).not.toHaveBeenCalled();
});
