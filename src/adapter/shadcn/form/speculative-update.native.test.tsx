import { startTransition, Suspense, useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from './form.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';
import { ShadcnInput } from '../input/input.adapter.js';
import { ShadcnCheckbox } from '../checkbox/checkbox.adapter.js';
import { ShadcnInputDate } from '../input-date/input-date.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

it.each(['required', 'disabled', 'host error'])(
  'replays the committed %s after the same instance suspends',
  async (kind) => {
    const submit = vi.fn();
    const attempted = vi.fn();
    const pending = new Promise<never>(() => undefined);
    function Fields({ speculative }: { speculative: boolean }) {
      return (
        <>
          <ShadcnFormField
            name="shared"
            error={!speculative && kind === 'host error' ? 'Host rejected' : undefined}
          >
            <ShadcnCheckbox
              label="Retained"
              checked={false}
              disabled={!speculative && kind === 'disabled'}
              required={!speculative && kind === 'required'}
              onCheckedChange={vi.fn()}
            />
          </ShadcnFormField>
          <Suspend speculative={speculative} />
        </>
      );
    }
    function Suspend({ speculative }: { speculative: boolean }) {
      if (speculative) {
        attempted();
        throw pending;
      }
      return null;
    }
    function Profile() {
      const [speculative, setSpeculative] = useState(false);
      return (
        <ShadcnForm label="Profile" onSubmit={submit}>
          <button
            type="button"
            onClick={() =>
              startTransition(() => {
                setSpeculative(true);
              })
            }
          >
            Attempt update
          </button>
          <Suspense fallback="Pending">
            <Fields speculative={speculative} />
          </Suspense>
          <ShadcnSubmitButton label="Save" />
        </ShadcnForm>
      );
    }
    render(<Profile />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Attempt update' }));
    await waitFor(() => expect(attempted).toHaveBeenCalled());
    await user.click(screen.getByRole('button', { name: 'Save' }));
    if (kind === 'disabled') {
      await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
      expect(screen.getByRole('checkbox', { name: 'Retained' })).toBeDisabled();
    } else {
      await waitFor(() =>
        expect(
          screen.getByRole('checkbox', {
            name: 'Retained',
          }),
        ).toHaveFocus(),
      );
      expect(submit).not.toHaveBeenCalled();
    }
  },
);

it('isolates equal names and focuses the segmented SDK handle', async () => {
  const accepted = vi.fn();
  const rejected = vi.fn();
  render(
    <>
      <ShadcnForm label="Accepted" onSubmit={accepted}>
        <ShadcnInput
          label="Name"
          name="same"
          value="Ada"
          required
          onValueChange={vi.fn()}
        />
        <ShadcnSubmitButton label="Save accepted" />
      </ShadcnForm>
      <ShadcnForm label="Rejected" onSubmit={rejected}>
        <ShadcnInputDate
          label="Delivery"
          referenceDate="2026-11-01"
          name="same"
          value={null}
          required
          onValueChange={vi.fn()}
        />
        <ShadcnSubmitButton label="Save rejected" />
      </ShadcnForm>
    </>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Save rejected' }));
  const rejectedForm = screen.getByRole('form', { name: 'Rejected' });
  await waitFor(() =>
    expect(
      within(rejectedForm).getByRole('spinbutton', {
        name: /month/i,
      }),
    ).toHaveFocus(),
  );
  expect(rejected).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Save accepted' }));
  await waitFor(() => expect(accepted).toHaveBeenCalledExactlyOnceWith());
  expect(rejected).not.toHaveBeenCalled();
});
