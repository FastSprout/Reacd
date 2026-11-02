import { MuiSwitch } from '../switch/switch.adapter.js';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiForm } from './form.adapter.js';
import { MuiInput } from '../input/input.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
it('composes Material form controls and native required validation', async () => {
  const submit = vi.fn<() => void>();
  const view = render(
    <MuiForm label="Contact" onSubmit={submit}>
      <MuiInput label="Name" value="" required onValueChange={() => undefined} />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  view.rerender(
    <MuiForm label="Contact" onSubmit={submit}>
      <MuiInput label="Name" value="Ada" required onValueChange={() => undefined} />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).toHaveBeenCalledWith();
  view.rerender(
    <MuiForm label="Contact" onSubmit={submit} submitting>
      <MuiInput label="Name" value="Ada" onValueChange={() => undefined} />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  expect(
    screen.getByRole('button', { name: 'Save' }).closest('fieldset'),
  ).toHaveAttribute('inert');
});

it('renders server summary through Material Alert and List', () => {
  render(
    <MuiForm
      label="Contact"
      onSubmit={() => undefined}
      errors={[{ label: 'Name', message: 'Check the name' }]}
    />,
  );
  expect(screen.getByRole('alert').className).toContain('MuiAlert-root');
  expect(screen.getByText('Check the name')).toBeVisible();
});

it('rejects semantic nesting rather than emitting nested native forms', () => {
  render(
    <MuiForm label="Outer" onSubmit={() => undefined}>
      <MuiForm label="Inner" onSubmit={() => undefined} />
    </MuiForm>,
  );
  expect(screen.getAllByRole('form')).toHaveLength(1);
  expect(screen.getByRole('alert').className).toContain('MuiAlert-root');
  expect(screen.getByRole('alert')).toHaveTextContent('Forms cannot be nested.');
});

it('blocks programmatic submission while disabled or outside the active scope', () => {
  const submit = vi.fn<() => void>();
  const view = render(<MuiForm label="Contact" onSubmit={submit} disabled />);
  fireEvent.submit(screen.getByRole('form', { name: 'Contact' }));
  expect(submit).not.toHaveBeenCalled();
  view.rerender(<MuiForm label="Contact" onSubmit={submit} errors={[]} />);
  fireEvent.submit(screen.getByRole('form', { name: 'Contact' }));
  expect(submit).toHaveBeenCalledWith();
});

it('retains submitting FormData and omits disabled fields', () => {
  const view = render(
    <MuiForm label="Contact" onSubmit={() => undefined} submitting>
      <MuiInput
        name="company"
        label="Company"
        value="Acme"
        onValueChange={() => undefined}
      />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  const form = view.container.querySelector('form');
  if (form === null) throw new Error('Expected native form');
  expect(new FormData(form).get('company')).toBe('Acme');
  expect(
    screen.getByRole('textbox', { name: 'Company' }).closest('fieldset'),
  ).toHaveAttribute('inert');
  view.rerender(
    <MuiForm label="Contact" onSubmit={() => undefined} disabled>
      <MuiInput
        name="company"
        label="Company"
        value="Acme"
        onValueChange={() => undefined}
      />
    </MuiForm>,
  );
  expect(new FormData(form).has('company')).toBe(false);
});

it('keeps loading field values enabled for canonical serialization', () => {
  const view = render(
    <MuiForm label="Settings" onSubmit={() => undefined}>
      <MuiInput
        label="Company"
        name="company"
        value="Acme"
        loading
        onValueChange={() => undefined}
      />
      <MuiSwitch
        label="Enabled"
        name="enabled"
        checked
        loading
        onCheckedChange={() => undefined}
      />
    </MuiForm>,
  );
  const form = view.container.querySelector('form');
  if (form === null) throw new Error('Expected native form');
  expect([...new FormData(form).entries()]).toEqual([
    ['company', 'Acme'],
    ['enabled', 'on'],
  ]);
  expect(screen.getByRole('progressbar', { name: 'Updating Enabled' })).toBeVisible();
});
