import { act, fireEvent, render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ListboxFormBridge } from './form-bridge.js';

const base = {
  values: ['42'],
  multiple: false,
  name: undefined,
  required: undefined,
  disabled: undefined,
  root: null,
  errorId: 'error',
  invalid: false,
  markInvalid: () => undefined,
  reset: () => true,
} as const;

it('does not expose business changes through its hidden validity proxy', () => {
  const invalid = vi.fn();
  const { container } = render(
    <ListboxFormBridge {...base} values={[]} required markInvalid={invalid} />,
  );
  const proxy = container.querySelector<HTMLInputElement>('input[type="text"]');
  if (proxy === null) throw new Error('Expected scoped validity proxy.');
  fireEvent.change(proxy, { target: { value: 'autofill' } });
  fireEvent.invalid(proxy);
  expect(invalid).toHaveBeenCalledExactlyOnceWith();
});

it('honors canceled resets and releases native capabilities', async () => {
  const reset = vi.fn(() => true);
  const view = render(
    <form onReset={(event) => event.preventDefault()}>
      <ListboxFormBridge {...base} reset={reset} />
    </form>,
  );
  const form = view.container.querySelector('form');
  if (form === null) throw new Error('Expected form.');
  await act(async () => {
    form.dispatchEvent(
      new Event('reset', {
        bubbles: true,
        cancelable: true,
      }),
    );
  });
  expect(reset).not.toHaveBeenCalled();
  view.rerender(
    <form>
      <ListboxFormBridge {...base} reset={reset} />
    </form>,
  );
  await act(async () => {
    form.dispatchEvent(new Event('reset'));
    view.unmount();
  });
  expect(reset).not.toHaveBeenCalled();
  form.dispatchEvent(new Event('reset'));
  expect(reset).not.toHaveBeenCalled();
});
