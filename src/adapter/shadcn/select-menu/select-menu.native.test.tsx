import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnSelectMenu } from './select-menu.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

const items = [
  { value: 'a', label: 'Alpha', description: 'Kraków team' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma', disabled: true },
];

it('uses native popup selection while keeping search separate', async () => {
  function Example() {
    const [value, change] = useState('b');
    const [query, search] = useState('');
    return (
      <ShadcnSelectMenu
        label="Owner"
        value={value}
        onValueChange={change}
        query={query}
        onQueryChange={search}
        items={items}
      />
    );
  }
  render(<Example />);
  const trigger = screen.getByRole('combobox', { name: 'Owner' });
  await userEvent.click(trigger);
  const search = await screen.findByRole('combobox', { name: 'Search Owner' });
  await userEvent.type(search, 'krakow');
  expect(screen.getByRole('option', { name: /Alpha/u })).toBeVisible();
  expect(screen.queryByRole('option', { name: 'Beta' })).toBeNull();
  await userEvent.keyboard('{ArrowDown}{Enter}');
  expect(trigger).toHaveTextContent('Alpha');
  await waitFor(() => expect(screen.queryByRole('combobox',
    { name: 'Search Owner' })).toBeNull());
  await userEvent.click(trigger);
  expect(await screen.findByRole('combobox', { name: 'Search Owner' }))
    .toHaveValue('krakow');
});

it('serializes multiple opaque keys in host order through native SDK inputs', () => {
  const view = render(
    <form>
      <ShadcnSelectMenu
        label="Owners"
        mode="multiple"
        value={['b', 'a']}
        name="owners"
        items={items}
        onValueChange={vi.fn()}
      />
    </form>,
  );
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Missing test form.');
  expect(new FormData(form).getAll('owners')).toEqual(['b', 'a']);
});

it('blocks required submission and focuses the visible SDK trigger', async () => {
  const save = vi.fn();
  render(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnSelectMenu
        label="Owner"
        value=""
        required
        items={items}
        onValueChange={vi.fn()}
      />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(save).not.toHaveBeenCalled();
  expect(screen.getByRole('combobox', { name: 'Owner' })).toHaveFocus();
});

it('accepts native choice changes inside the managed SDK form', async () => {
  const save = vi.fn();
  function Example() {
    const [value, change] = useState('');
    return (
      <ShadcnForm label="Review" onSubmit={save}>
        <ShadcnSelectMenu
          label="Owner"
          value={value}
          required
          items={items}
          onValueChange={change}
        />
        <ShadcnSubmitButton label="Save" />
      </ShadcnForm>
    );
  }
  render(<Example />);
  await userEvent.click(screen.getByRole('combobox', { name: 'Owner' }));
  await userEvent.click(await screen.findByRole('option', { name: 'Beta' }));
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(save).toHaveBeenCalledWith();
});
