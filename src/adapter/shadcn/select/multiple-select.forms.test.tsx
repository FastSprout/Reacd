import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';
import { ShadcnSelect } from './select.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

const items = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
];

it('serializes selected native values with a closed popup', () => {
  const view = render(
    <form>
      <ShadcnSelect
        label="Choices"
        mode="multiple"
        name="choices"
        value={['one', 'two']}
        items={items}
        onValueChange={vi.fn()}
      />
    </form>,
  );
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Missing test form.');
  expect(new FormData(form).getAll('choices')).toEqual(['one', 'two']);
  expect(screen.queryByRole('listbox')).toBeNull();
});

it('blocks native required submission and focuses the SDK trigger', async () => {
  const save = vi.fn();
  render(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnSelect
        label="Choices"
        mode="multiple"
        name="choices"
        required
        value={[]}
        items={items}
        onValueChange={vi.fn()}
      />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(save).not.toHaveBeenCalled();
  expect(screen.getByRole('combobox', { name: 'Choices' })).toHaveFocus();
});

it('blocks required single selection and focuses its visible SDK trigger', async () => {
  const save = vi.fn();
  render(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnSelect
        label="Choice"
        value=""
        items={items}
        required
        onValueChange={vi.fn()}
      />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(save).not.toHaveBeenCalled();
  expect(screen.getByRole('combobox', { name: 'Choice' })).toHaveFocus();
  expect(screen.getByRole('alert')).toHaveTextContent('Choose an option');
});

it('registers native multiple selection changes in an optional SDK form', async () => {
  const save = vi.fn();
  const change = vi.fn();
  render(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnSelect
        label="Choices"
        mode="multiple"
        value={[]}
        items={items}
        onValueChange={change}
      />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Choices' }));
  await userEvent.click(await screen.findByRole('option', { name: 'One' }));
  expect(change).toHaveBeenCalledWith(['one']);
  await userEvent.keyboard('{Escape}');
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(save).toHaveBeenCalledWith());
});

it.each(['single', 'multiple'] as const)(
  'blocks controlled field errors for %s native Select',
  async (mode) => {
    const save = vi.fn();
    render(
      <ShadcnForm label="Review" onSubmit={save}>
        <ShadcnFormField name="choice" error="Choice is locked.">
          {mode === 'single' ? (
            <ShadcnSelect
              label="Choice"
              value="one"
              items={items}
              onValueChange={vi.fn()}
            />
          ) : (
            <ShadcnSelect
              label="Choice"
              mode="multiple"
              value={['one']}
              items={items}
              onValueChange={vi.fn()}
            />
          )}
        </ShadcnFormField>
        <ShadcnSubmitButton label="Save" />
      </ShadcnForm>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(save).not.toHaveBeenCalled();
    expect(screen.getByRole('combobox', { name: 'Choice' })).toHaveFocus();
  },
);
