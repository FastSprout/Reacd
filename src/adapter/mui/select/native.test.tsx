import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { MuiForm } from '../form/form.adapter.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiSelect } from './select.adapter.js';
const items = [
  { value: 'reader', label: 'Reader' },
  { value: 'editor', label: 'Editor' },
];
it('uses Material Select and returns a scalar selection', async () => {
  const change = vi.fn<(value: string) => void>();
  render(
    <MuiSelect label="Role" value="reader" items={items} onValueChange={change} />,
  );
  const select = screen.getByRole('combobox', { name: 'Role' });
  expect(select.closest('.MuiSelect-root')).not.toBeNull();
  await userEvent.click(select);
  await userEvent.click(screen.getByRole('option', { name: 'Editor' }));
  expect(change).toHaveBeenCalledWith('editor');
});
it('returns controlled multiple values through the native menu', async () => {
  const change = vi.fn<(value: readonly string[]) => void>();
  render(
    <MuiSelect
      label="Roles"
      value={['reader']}
      mode="multiple"
      items={items}
      onValueChange={change}
      clearable
    />,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Roles' }));
  await userEvent.click(screen.getByRole('option', { name: 'Editor' }));
  expect(change).toHaveBeenCalledWith(['reader', 'editor']);
  await userEvent.keyboard('{Escape}');
  await userEvent.click(screen.getByRole('button', { name: 'Clear Roles' }));
  expect(change).toHaveBeenLastCalledWith([]);
});

it('provides native placeholder and scalar clearing', async () => {
  const change = vi.fn<(value: string) => void>();
  render(
    <MuiSelect
      label="Role"
      value="reader"
      items={items}
      onValueChange={change}
      placeholder="Choose role"
      description="Choose access"
      clearable
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Clear Role' }));
  expect(change).toHaveBeenCalledWith('');
});

it('closes native popups while retaining canonical values', async () => {
  const change = vi.fn<(value: string) => void>();
  const view = render(
    <MuiForm label="Choice" onSubmit={() => undefined}>
      <MuiSelect
        label="Region"
        name="region"
        value="eu"
        onValueChange={change}
        items={[{ value: 'eu', label: 'Europe' }]}
      />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Region' }));
  expect(screen.getByRole('listbox')).toBeVisible();
  view.rerender(
    <MuiForm label="Choice" onSubmit={() => undefined} submitting>
      <MuiSelect
        label="Region"
        name="region"
        value="eu"
        onValueChange={change}
        items={[{ value: 'eu', label: 'Europe' }]}
      />
    </MuiForm>,
  );
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  const form = view.container.querySelector('form');
  if (form === null) throw new Error('Expected native form');
  expect(new FormData(form).get('region')).toBe('eu');
  expect(change).not.toHaveBeenCalled();
});

it('allows readonly inspection but rejects value changes', async () => {
  const change = vi.fn<(value: string) => void>();
  render(
    <MuiSelect
      label="Role"
      value="reader"
      items={items}
      onValueChange={change}
      readOnly
    />,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Role' }));
  await userEvent.click(screen.getByRole('option', { name: 'Editor' }));
  expect(change).not.toHaveBeenCalled();
});
it('throws for unsupported native repeated-entry serialization', () => {
  expect(() =>
    render(
      <MuiSelect
        label="Roles"
        name="roles"
        mode="multiple"
        value={['reader']}
        items={items}
        onValueChange={() => undefined}
      />,
    ),
  ).toThrow('Adapter "material-ui" does not support component "Select".');
});

it('displays native empty, summarized and described values', async () => {
  const view = render(
    <MuiSelect label="Role" value="" items={items} onValueChange={() => undefined} />,
  );
  expect(screen.getByText('Choose an option.')).toBeVisible();
  view.rerender(
    <MuiSelect
      label="Role"
      value=""
      items={items}
      placeholder="Choose role"
      onValueChange={() => undefined}
    />,
  );
  expect(screen.getAllByText('Choose role').length).toBeGreaterThan(0);
  view.rerender(
    <MuiSelect
      label="Roles"
      mode="multiple"
      value={['a', 'b', 'c']}
      items={[
        { value: 'a', label: 'A', description: 'First option' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ]}
      onValueChange={() => undefined}
      loading
    />,
  );
  expect(screen.getByText('3 selected')).toBeVisible();
  expect(screen.getByRole('progressbar', { name: 'Loading options.' })).toBeVisible();
  await userEvent.click(screen.getByRole('combobox', { name: 'Roles' }));
  expect(screen.getByText('First option')).toBeVisible();
});

it('focuses the SDK trigger for required validation', async () => {
  const submit = vi.fn<() => void>();
  render(
    <MuiForm label="Choice" onSubmit={submit}>
      <MuiSelect
        label="Role"
        value=""
        items={items}
        required
        readOnly
        onValueChange={() => undefined}
      />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole('combobox', { name: 'Role' })).toHaveFocus();
  expect(screen.getByRole('combobox', { name: 'Role' })).toHaveAttribute(
    'aria-readonly',
    'true',
  );
});
