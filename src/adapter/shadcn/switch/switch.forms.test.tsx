import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnSwitch } from './switch.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

it('blocks required submission and focuses the visible SDK switch', async () => {
  const save = vi.fn();
  const change = vi.fn();
  const view = render(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnSwitch label="Publish" checked={false} required onCheckedChange={change} />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(save).not.toHaveBeenCalled();
  expect(screen.getByRole('switch', { name: 'Publish' })).toHaveFocus();
  expect(screen.getByRole('alert')).toHaveTextContent('Enable this setting');
  await userEvent.keyboard(' ');
  expect(change).toHaveBeenCalledWith(true);
  view.rerender(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnSwitch label="Publish" checked required onCheckedChange={change} />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(save).toHaveBeenCalledWith());
});

it('validates field errors and accepts an optional false value', async () => {
  const save = vi.fn();
  const view = render(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnFormField name="publish" error="Publication is locked.">
        <ShadcnSwitch label="Publish" checked={false} onCheckedChange={vi.fn()} />
      </ShadcnFormField>
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(save).not.toHaveBeenCalled();
  expect(screen.getByRole('switch', { name: 'Publish' })).toHaveFocus();
  view.rerender(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnFormField name="publish">
        <ShadcnSwitch label="Publish" checked={false} onCheckedChange={vi.fn()} />
      </ShadcnFormField>
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(save).toHaveBeenCalledWith());
});

it('keeps loading native values enabled and rejects writes', async () => {
  const change = vi.fn();
  const view = render(
    <form>
      <ShadcnSwitch
        label="Publish"
        checked
        name="publish"
        value="yes"
        loading
        onCheckedChange={change}
      />
    </form>,
  );
  const control = screen.getByRole('switch', { name: 'Publish' });
  control.focus();
  expect(control).toHaveFocus();
  await userEvent.keyboard(' ');
  expect(change).not.toHaveBeenCalled();
  expect(control).not.toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('Updating Publish');
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Missing test form.');
  expect(new FormData(form).get('publish')).toBe('yes');
});
