import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnInputTags } from './input-tags.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

it('validates committed tags and focuses the actual native input', async () => {
  const submit = vi.fn();
  const contents = (value: readonly string[], error?: string) => (
    <ShadcnForm label="Topics form" onSubmit={submit}>
      <ShadcnFormField name="topics" required error={error} description="Choose topics">
        <ShadcnInputTags label="Topics" value={value} onValueChange={vi.fn()} />
      </ShadcnFormField>
      <ShadcnSubmitButton label="Save topics" />
    </ShadcnForm>
  );
  const view = render(contents([]));
  const input = screen.getByRole('combobox', { name: 'Topics' });
  await userEvent.type(input, 'Uncommitted');
  await userEvent.click(screen.getByRole('button', { name: 'Save topics' }));
  expect(submit).not.toHaveBeenCalled();
  expect(input).toHaveFocus();
  expect(screen.getByRole('alert')).toHaveTextContent('Add at least one tag');
  view.rerender(contents(['Vue'], 'Topics are locked.'));
  await waitFor(() =>
    expect(input).toHaveAccessibleDescription('Choose topics Topics are locked.'),
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save topics' }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getAllByRole('alert')).toHaveLength(1);
  view.rerender(contents(['Vue']));
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  await userEvent.click(screen.getByRole('button', { name: 'Save topics' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
});

it('serializes canonical ordered tags once and never names the draft', async () => {
  const contents = (name?: string, disabled?: boolean) => (
    <form aria-label="Raw form">
      <ShadcnInputTags
        label="Topics"
        name={name}
        disabled={disabled}
        readOnly
        value={['Vue', 'React']}
        onValueChange={vi.fn()}
      />
    </form>
  );
  const view = render(contents());
  const form = screen.getByRole('form', { name: 'Raw form' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing test form.');
  expect(Array.from(new FormData(form))).toEqual([]);
  view.rerender(contents('topics'));
  expect(Array.from(new FormData(form))).toEqual([
    ['topics', 'Vue'],
    ['topics', 'React'],
  ]);
  expect(screen.getByRole('combobox')).toHaveAttribute('readonly');
  view.rerender(contents('topics', true));
  expect(screen.getByRole('combobox')).toBeDisabled();
  expect(Array.from(new FormData(form))).toEqual([]);
});

it('notifies native form registration after committed token edits', async () => {
  const submit = vi.fn();
  function Sample() {
    const [value, setValue] = useState<readonly string[]>([]);
    return (
      <ShadcnForm label="Topics form" onSubmit={submit}>
        <ShadcnInputTags
          label="Topics"
          value={value}
          onValueChange={setValue}
          required
        />
        <ShadcnSubmitButton label="Save topics" />
      </ShadcnForm>
    );
  }
  render(<Sample />);
  await userEvent.type(screen.getByRole('combobox'), 'Vue{Enter}');
  await userEvent.click(screen.getByRole('button', { name: 'Save topics' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
});

it('retains controlled tokens and draft when a raw native form resets', async () => {
  const change = vi.fn();
  const view = render(
    <form>
      <ShadcnInputTags label="Topics" value={['React']} onValueChange={change} />
    </form>,
  );
  const input = screen.getByRole('combobox');
  await userEvent.type(input, 'Vue');
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Missing native test form');
  fireEvent.reset(form);
  expect(change).not.toHaveBeenCalled();
  expect(input).toHaveValue('Vue');
});
