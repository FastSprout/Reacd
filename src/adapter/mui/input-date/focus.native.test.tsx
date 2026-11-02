import type { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiFormFocusContext } from '../form/focus-context.js';
import { useDateValidation } from './use-date-validation.js';

it('cleans up focus metadata and tolerates an unmounted native field', () => {
  const callbacks = new Map<string, () => void>();
  const scope = {
    register: (id: string, focus: () => void) => {
      callbacks.set(id, focus);
      return () => {
        callbacks.delete(id);
      };
    },
  };
  function Wrapper({ children }: { readonly children: ReactNode }) {
    return <MuiFormFocusContext value={scope}>{children}</MuiFormFocusContext>;
  }
  const view = renderHook(
    () =>
      useDateValidation({
        id: 'date',
        label: 'Event',
        value: '',
        required: true,
        disabled: false,
      }),
    { wrapper: Wrapper },
  );
  const focus = callbacks.get('date');
  if (focus === undefined) throw new Error('Missing date focus metadata.');
  expect(() => focus()).not.toThrow();
  view.unmount();
  expect(callbacks.size).toBe(0);
});
