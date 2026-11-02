import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { expect, it, vi } from 'vitest';
import { MuiForm } from './form.adapter.js';
import { MuiInput } from '../input/input.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';

it('keeps native pending feedback readable and retains data', async () => {
  const submit = vi.fn<() => void>();
  const view = render(
    <MuiForm
      label="Review"
      submitting
      onSubmit={submit}
      errors={[{ message: 'Retry is available.' }]}
    >
      <MuiInput
        label="Project"
        name="project"
        value="Local"
        onValueChange={() => undefined}
      />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  const status = screen.getByRole('progressbar', { name: 'Submitting Review' });
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
