import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnInput } from '../input/input.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

it('validates optional drafts on submission and allows editing', async () => {
  const submit = vi.fn();
  function Draft() {
    const [value, change] = useState('');
    return (
      <ShadcnForm label="Draft" onSubmit={submit}>
        <ShadcnInput
          label="Reference"
          name="reference"
          value={value}
          onValueChange={change}
          minLength={4}
        />
        <ShadcnSubmitButton label="Save" />
      </ShadcnForm>
    );
  }
  render(<Draft />);
  const input = screen.getByRole('textbox', { name: 'Reference' });
  const save = screen.getByRole('button', { name: 'Save' });
  await userEvent.click(save);
  expect(submit).toHaveBeenCalledOnce();
  await userEvent.type(input, 'ab');
  expect(input).toHaveValue('ab');
  await userEvent.tab();
  await userEvent.click(save);
  expect(screen.getByRole('alert')).toHaveTextContent('Enter at least 4 characters.');
  expect(submit).toHaveBeenCalledOnce();
  await userEvent.clear(input);
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  await userEvent.click(save);
  expect(submit).toHaveBeenCalledTimes(2);
});
