import { Component, StrictMode, useState, type ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from './form.adapter.js';
import { ShadcnInput } from '../input/input.adapter.js';
import { ShadcnCalendar } from '../calendar/calendar.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

class Recovery extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}
function Abandoned(): never {
  throw new Error('Expected recovery fixture');
}

it('preserves readonly validation after same-name recovery', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const submit = vi.fn();
  function Fields() {
    const [added, setAdded] = useState(false);
    return (
      <>
        <ShadcnInput
          label="Retained"
          name="shared"
          value=""
          readOnly
          required
          onValueChange={vi.fn()}
        />
        <button type="button" onClick={() => setAdded(true)}>
          Add
        </button>
        {added && (
          <Recovery>
            <ShadcnInput
              label="Discarded"
              name="shared"
              value="Allowed"
              onValueChange={vi.fn()}
            />
            <Abandoned />
          </Recovery>
        )}
      </>
    );
  }
  try {
    render(
      <ShadcnForm label="Profile" onSubmit={submit}>
        <Fields />
        <ShadcnSubmitButton label="Save" />
      </ShadcnForm>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Retained' })).toHaveFocus(),
    );
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a value.');
  } finally {
    log.mockRestore();
  }
});

it('keeps dotted and duplicate native keys independent under StrictMode', async () => {
  const submit = vi.fn();
  const view = render(
    <StrictMode>
      <ShadcnForm label="Profile" onSubmit={submit}>
        <ShadcnInput
          label="Parent"
          name="profile"
          value="root"
          required
          onValueChange={vi.fn()}
        />
        <ShadcnInput
          label="Child"
          name="profile.name"
          value="Ada"
          required
          onValueChange={vi.fn()}
        />
        <ShadcnInput
          label="Duplicate"
          name="profile.name"
          value="Grace"
          required
          onValueChange={vi.fn()}
        />
        <ShadcnSubmitButton label="Save" />
      </ShadcnForm>
    </StrictMode>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Expected form');
  expect([...new FormData(form)]).toEqual([
    ['profile', 'root'],
    ['profile.name', 'Ada'],
    ['profile.name', 'Grace'],
  ]);
});

it('validates duplicate names and clears accepted errors', async () => {
  const submit = vi.fn();
  function Fields() {
    const [value, setValue] = useState('');
    return (
      <>
        <ShadcnInput
          label="Required"
          name="shared"
          value={value}
          required
          minLength={3}
          onValueChange={setValue}
        />
        <ShadcnInput
          label="Other"
          name="shared"
          value="Complete"
          onValueChange={vi.fn()}
        />
      </>
    );
  }
  render(
    <ShadcnForm label="Profile" onSubmit={submit}>
      <Fields />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  await user.type(screen.getByRole('textbox', { name: 'Required' }), 'Ada');
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
  expect(screen.queryByRole('alert')).toBeNull();
});

it('retains disabled Calendar state without a target ref', async () => {
  const submit = vi.fn();
  const view = render(
    <ShadcnForm label="Profile" onSubmit={submit}>
      <ShadcnCalendar
        label="Disabled"
        referenceDate="2026-11-01"
        value={null}
        disabled
        required
        name="disabled"
        onValueChange={vi.fn()}
      />
      <ShadcnCalendar
        label="Selected"
        referenceDate="2026-11-01"
        value="2026-11-05"
        required
        name="delivery"
        onValueChange={vi.fn()}
      />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Expected form');
  expect([...new FormData(form)]).toEqual([['delivery', '2026-11-05']]);
});
