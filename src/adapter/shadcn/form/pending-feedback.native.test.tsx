import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from './form.adapter.js';
import { ShadcnInput } from '../input/input.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

it('keeps pending feedback outside busy and inert content', async () => {
  const submit = vi.fn<() => void>();
  const view = render(
    <ShadcnForm
      label="Review"
      submitting
      onSubmit={submit}
      errors={[{ message: 'Retry is available.' }]}
    >
      <ShadcnInput
        label="Project"
        name="project"
        value="Local"
        onValueChange={() => undefined}
      />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  const status = screen.getByRole('status');
  expect(status).toHaveTextContent('Submitting Review');
  expect(status.closest('[aria-busy="true"], [inert], form')).toBeNull();
  const summary = screen.getByRole('alert');
  expect(summary).toHaveTextContent('Retry is available.');
  expect(summary.closest('[inert]')).toBeNull();
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Expected native review form.');
  expect(form).toHaveAttribute('aria-busy', 'true');
  expect(form.querySelector('fieldset')).toHaveAttribute('inert');
  expect([...new FormData(form)]).toEqual([['project', 'Local']]);
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  await act(async () => {
    form.requestSubmit();
  });
  expect(submit).not.toHaveBeenCalled();
});
