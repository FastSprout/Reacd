import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';
import { ShadcnTextarea } from './textarea.adapter.js';

it('validates required and minimum readonly text with RHF', async () => {
  const submit = vi.fn();
  const content = (value: string) => (
    <ShadcnForm label="Release" onSubmit={submit}>
      <ShadcnTextarea
        label="Notes"
        value={value}
        name="notes"
        required
        readOnly
        minLength={4}
        onValueChange={() => undefined}
      />
      <ShadcnSubmitButton label="Publish" />
    </ShadcnForm>
  );
  const view = render(content(''));
  await userEvent.click(screen.getByRole('button', { name: 'Publish' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Enter a value.');
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveFocus(),
  );
  view.rerender(content('ab'));
  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent('Enter at least 4 characters.'),
  );
  expect(submit).not.toHaveBeenCalled();
  view.rerender(content('Release notes'));
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  await userEvent.click(screen.getByRole('button', { name: 'Publish' }));
  expect(submit).toHaveBeenCalledExactlyOnceWith();
});
