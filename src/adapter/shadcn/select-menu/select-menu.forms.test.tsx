import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnSelectMenu } from './select-menu.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

it.each(['optional', 'disabled'] as const)(
  'clears existing required feedback when the host makes a field %s',
  async (mode) => {
    const submit = vi.fn();
    const contents = (required: boolean, disabled: boolean) => (
      <ShadcnForm label="Record" onSubmit={submit}>
        <ShadcnSelectMenu
          label="Owner"
          value=""
          name="owner"
          readOnly
          items={[{ value: '42', label: 'Answer' }]}
          required={required}
          disabled={disabled}
          onValueChange={vi.fn()}
        />
        <ShadcnSubmitButton label="Save" />
      </ShadcnForm>
    );
    const view = render(contents(true, false));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole('combobox', { name: 'Owner' })).toHaveFocus();
    expect(screen.getByRole('alert')).toHaveTextContent('Choose an option');
    view.rerender(contents(mode !== 'optional', mode === 'disabled'));
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
    const form = screen.getByRole('form', { name: 'Record' });
    if (!(form instanceof HTMLFormElement)) throw new Error('Missing SDK form.');
    expect(Array.from(new FormData(form))).toEqual(
      mode === 'disabled' ? [] : [['owner', '']],
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
  },
);
