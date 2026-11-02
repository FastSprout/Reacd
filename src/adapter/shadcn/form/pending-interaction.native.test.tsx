import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { FormPendingContext } from '../../../renderer/form/interaction-context.js';
import { ShadcnForm } from './form.adapter.js';
import { ShadcnInput } from '../input/input.adapter.js';
import { ShadcnButton } from '../button/button.adapter.js';
import { ShadcnSelect } from '../select/select.adapter.js';

it('inherits pending protection while preserving visible named fields', () => {
  const change = vi.fn();
  const press = vi.fn();
  render(
    <FormPendingContext value={true}>
      <ShadcnForm label="Profile" onSubmit={vi.fn()}>
        <ShadcnInput label="Name" name="name" value="Ada" onValueChange={change} />
        <ShadcnButton label="Action" onPress={press} />
      </ShadcnForm>
    </FormPendingContext>,
  );
  const form = screen.getByRole('form', { name: 'Profile' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form');
  expect(form).toHaveAttribute('aria-busy', 'true');
  expect(form.querySelector('fieldset')).toHaveAttribute('inert');
  expect([...new FormData(form)]).toEqual([['name', 'Ada']]);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Grace' } });
  fireEvent.click(screen.getByRole('button', { name: 'Action' }));
  expect(change).not.toHaveBeenCalled();
  expect(press).not.toHaveBeenCalled();
});

it(
  'closes native selection popups but preserves their visible field value',
  async () => {
  const change = vi.fn();
  function Profile({ pending }: { pending: boolean }) {
    return (
      <ShadcnForm label="Profile" onSubmit={vi.fn()} submitting={pending}>
        <ShadcnSelect
          label="Role"
          name="role"
          value="viewer"
          onValueChange={change}
          items={[{ value: 'viewer', label: 'Viewer' }]}
        />
      </ShadcnForm>
    );
  }
  const view = render(<Profile pending={false} />);
  await userEvent.click(screen.getByRole('combobox', { name: 'Role' }));
  expect(screen.getByRole('option', { name: 'Viewer' })).toBeVisible();
  view.rerender(<Profile pending />);
  await waitFor(() => expect(screen.queryByRole('option')).toBeNull());
  const form = screen.getByRole('form', { name: 'Profile' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form');
  expect([...new FormData(form)]).toEqual([['role', 'viewer']]);
  expect(change).not.toHaveBeenCalled();
});
