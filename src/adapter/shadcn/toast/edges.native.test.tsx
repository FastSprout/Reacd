import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { toastActionSchema, toastChangeSchema } from
  '../../../schema/toast/toast.schema.js';
import { NativeToastSurface } from './provider.js';
import { ShadcnToast } from './toast.adapter.js';

it('fails closed for action veto, invalid output and exceptions, then recovers',
  async () => {
    const change = vi.fn();
    const action = vi.fn<() => boolean | void>(() => false);
    const view = render(<NativeToastSurface><ShadcnToast title="Action" open
      onOpenChange={change} intent="success" action={{ label: 'Undo', onPress: action }}
    /></NativeToastSurface>);
    const card = await screen.findByRole('dialog', { name: 'Action' });
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(action).toHaveBeenCalledExactlyOnceWith();
    expect(within(card).getByRole('status')).toHaveTextContent('change was rejected');
    action.mockImplementationOnce(() => { throw new Error('Unavailable'); });
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(within(card).getByRole('alert')).toHaveTextContent('action failed');
    view.rerender(<NativeToastSurface><ShadcnToast title="Action" open
      onOpenChange={change} action={toastActionSchema.parse({
        label: 'Invalid', onPress: () => 'invalid',
      })} /></NativeToastSurface>);
    await userEvent.click(screen.getByRole('button', { name: 'Invalid' }));
    expect(within(card).getByRole('alert')).toHaveTextContent('callbacks must return');
    view.rerender(<NativeToastSurface><ShadcnToast title="Action" open
      onOpenChange={change} closeOnAction={false}
      action={{ label: 'Inspect', onPress: action }} /></NativeToastSurface>);
    action.mockReturnValue(undefined);
    await userEvent.click(screen.getByRole('button', { name: 'Inspect' }));
    expect(change).not.toHaveBeenCalled();
    expect(within(card).queryByRole('alert')).toBeNull();
    expect(within(card).queryByRole('status')).toBeNull();
  },
);

it('reports invalid close callbacks without closing the controlled Root', async () => {
  const invalid = toastChangeSchema.parse(() => 'invalid');
  render(<NativeToastSurface><ShadcnToast title="Invalid" open
    onOpenChange={invalid} duration="persistent" closeLabel="Keep record" />
  </NativeToastSurface>);
  const card = await screen.findByRole('dialog', { name: 'Invalid' });
  await userEvent.click(screen.getByRole('button', { name: 'Keep record' }));
  expect(within(card).getByRole('alert')).toHaveTextContent('callbacks must return');
  expect(card).toBeVisible();
});

it('requires the trusted SDK Surface rather than using a global manager', () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  try {
    expect(() => render(<ShadcnToast title="Unowned" open
      onOpenChange={() => undefined} />)).toThrow('native shadcn Surface');
  } finally { log.mockRestore(); }
});
