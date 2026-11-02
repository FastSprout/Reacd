import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { useForm } from 'react-hook-form';
import { Form } from '../vendor/ui/form.js';
import { ShadcnCheckbox } from '../checkbox/checkbox.adapter.js';
import { useState } from 'react';

it('retains native SDK provider interoperability', async () => {
  const submit = vi.fn();
  function SdkForm() {
    const sdk = useForm<Record<string, unknown>>();
    const [checked, setChecked] = useState(false);
    return (
      <Form {...sdk}>
        <form onSubmit={sdk.handleSubmit(() => { submit(); })}>
          <ShadcnCheckbox
            label="Terms"
            checked={checked}
            required
            onCheckedChange={setChecked}
          />
          <button type="submit">Save</button>
        </form>
      </Form>
    );
  }
  render(<SdkForm />);
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(screen.getByRole('checkbox')).toHaveFocus());
  expect(submit).not.toHaveBeenCalled();
  await user.click(screen.getByRole('checkbox'));
  await user.tab();
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
});
