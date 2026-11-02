import { useState } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';
import { ShadcnSelect } from './select.adapter.js';
import { ShadcnRadioGroup } from '../radio-group/radio-group.adapter.js';

const items = [{ value: 'reader', label: 'Reader' }];

it.each(['multiple', 'radio'] as const)(
  'omits unnamed %s choices from native submission',
  (kind) => {
    const renderChoice = (name?: string) =>
      kind === 'multiple' ? (
        <ShadcnSelect
          label="Roles"
          mode="multiple"
          name={name}
          value={['reader']}
          items={items}
          onValueChange={() => undefined}
        />
      ) : (
        <ShadcnRadioGroup
          label="Role"
          name={name}
          value="reader"
          items={items}
          onValueChange={() => undefined}
        />
      );
    const view = render(<form>{renderChoice()}</form>);
    const form = view.container.querySelector('form');
    if (!form) throw new Error('Expected a native form.');
    expect(Array.from(new FormData(form))).toEqual([]);
    view.rerender(<form>{renderChoice('role')}</form>);
    expect(Array.from(new FormData(form))).toEqual([['role', 'reader']]);
  },
);

function Example({ name }: { readonly name?: string }) {
  return (
    <ShadcnForm label="Role form" onSubmit={() => undefined}>
      <ShadcnSelect
        label="Role"
        name={name}
        value="reader"
        items={items}
        onValueChange={() => undefined}
      />
    </ShadcnForm>
  );
}

it('serializes only an application logical name, never the SDK identifier', () => {
  const view = render(<Example />);
  const form = screen.getByRole('form', { name: 'Role form' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected a native form.');
  expect(Array.from(new FormData(form))).toEqual([]);
  view.rerender(<Example name="role" />);
  expect(Array.from(new FormData(form))).toEqual([['role', 'reader']]);
});

it('submits the accepted named value after required selection recovery', async () => {
  const save = vi.fn();
  function Controlled() {
    const [value, change] = useState('');
    return (
      <ShadcnForm label="Role form" onSubmit={save}>
        <ShadcnSelect
          label="Role"
          name="role"
          required
          value={value}
          items={items}
          onValueChange={change}
        />
        <ShadcnSubmitButton label="Save role" />
      </ShadcnForm>
    );
  }
  render(<Controlled />);
  const submit = screen.getByRole('button', { name: 'Save role' });
  const trigger = screen.getByRole('combobox', { name: 'Role' });
  await userEvent.click(submit);
  expect(save).not.toHaveBeenCalled();
  expect(trigger).toHaveFocus();
  await userEvent.click(trigger);
  await userEvent.click(await screen.findByRole('option', { name: 'Reader' }));
  await userEvent.click(submit);
  await waitFor(() => expect(save).toHaveBeenCalledExactlyOnceWith());
  const form = screen.getByRole('form', { name: 'Role form' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected a native form.');
  expect(Array.from(new FormData(form))).toEqual([['role', 'reader']]);
});

it('preserves descriptions without focusing an inactive multiple list', async () => {
  const change = vi.fn();
  const described = [
    { value: 'reader', label: 'Reader', description: 'Read project records.' },
  ];
  const content = (
    <ShadcnSelect
      label="Roles"
      mode="multiple"
      value={['reader']}
      items={described}
      onValueChange={change}
    />
  );
  const view = render(
    <PortalActiveContext value={true}>{content}</PortalActiveContext>,
  );
  const trigger = screen.getByRole('combobox', { name: 'Roles' });
  await userEvent.click(trigger);
  expect(await screen.findByText('Read project records.')).toBeVisible();
  const option = screen.getByRole('option', { name: /Reader/ });
  act(() => option.focus());
  expect(option).toHaveFocus();
  view.rerender(<PortalActiveContext value={false}>{content}</PortalActiveContext>);
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  expect(trigger).not.toHaveFocus();
  expect(change).not.toHaveBeenCalled();
});
