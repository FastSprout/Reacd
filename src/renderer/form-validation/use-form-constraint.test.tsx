import { renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { FormConstraint } from '../../core/form-constraint.js';
import { FormValidationContext } from './context.js';
import { useFormConstraint } from './use-form-constraint.js';

it('does not register outside a form scope', () => {
  const constraint = { id: 'field', label: 'Field', getMessage: () => 'Error' };
  const { result } = renderHook(() => useFormConstraint(constraint, false));
  expect(result.current).toBeUndefined();
});
it('registers enabled constraints and exposes messages after a submit attempt', () => {
  const constraint = { id: 'field', label: 'Field', getMessage: () => 'Error' };
  const remove = vi.fn<() => void>();
  const register = vi.fn<(value: FormConstraint) => () => void>(() => remove);
  let attempted = false;
  const view = renderHook(({ disabled }) => useFormConstraint(constraint, disabled), {
    initialProps: { disabled: false },
    wrapper: ({ children }) => (
      <FormValidationContext value={{ attempted, register }}>
        {children}
      </FormValidationContext>
    ),
  });
  expect(register).toHaveBeenCalledWith(constraint);
  expect(view.result.current).toBeUndefined();
  attempted = true;
  view.rerender({ disabled: false });
  expect(view.result.current).toBe('Error');
  view.rerender({ disabled: true });
  expect(remove).toHaveBeenCalledTimes(1);
  expect(view.result.current).toBeUndefined();
  view.rerender({ disabled: false });
  view.unmount();
  expect(remove).toHaveBeenCalledTimes(2);
});
