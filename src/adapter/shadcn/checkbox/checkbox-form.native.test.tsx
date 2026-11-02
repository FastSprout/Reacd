import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';
import { ShadcnCheckbox } from './checkbox.adapter.js';

it('focuses the visible control for required mixed values and submits canonical data',
  async () => {
    const submit = vi.fn();
    function Approval() {
      const [checked, setChecked] = useState(false);
      const [mixed, setMixed] = useState(true);
      return <ShadcnForm label="Approval" onSubmit={submit}>
        <ShadcnCheckbox label="Approve" name="approval" value="yes" required
          checked={checked} indeterminate={mixed}
          onCheckedChange={(value) => { setChecked(value); setMixed(false); }} />
        <ShadcnSubmitButton label="Save" />
      </ShadcnForm>;
    }
    render(<Approval />);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    const control = screen.getByRole('checkbox', { name: 'Approve' });
    await waitFor(() => expect(control).toHaveFocus());
    expect(control).toHaveAccessibleDescription('Select this option to continue.');
    expect(submit).not.toHaveBeenCalled();
    await userEvent.click(control);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(submit).toHaveBeenCalledOnce());
    const form = screen.getByRole('form', { name: 'Approval' });
    if (!(form instanceof HTMLFormElement)) throw new Error('Missing native form');
    expect(new FormData(form).getAll('approval')).toEqual(['yes']);
  });

it('does not block an optional unchecked value', async () => {
  const submit = vi.fn();
  render(<ShadcnForm label="Preferences" onSubmit={submit}>
    <ShadcnCheckbox label="Summary" checked={false} onCheckedChange={() => undefined} />
    <ShadcnSubmitButton label="Save" />
  </ShadcnForm>);
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledOnce());
});
