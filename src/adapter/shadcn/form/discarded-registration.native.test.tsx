import { Component, useState, type ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from './form.adapter.js';
import { ShadcnInput } from '../input/input.adapter.js';
import { ShadcnCheckbox } from '../checkbox/checkbox.adapter.js';
import { ShadcnSelect } from '../select/select.adapter.js';
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
function AbandonedSibling(): never {
  throw new Error('Expected abandoned-render fixture');
}

it.each(['input', 'checkbox', 'select'])(
  'validates the committed %s after sibling render recovery',
  async (kind) => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const submit = vi.fn();
    function Field() {
      const [value, setValue] = useState('');
      const [checked, setChecked] = useState(false);
      return kind === 'input' ? (
        <ShadcnInput label="Name" value={value} required onValueChange={setValue} />
      ) : kind === 'checkbox' ? (
        <ShadcnCheckbox
          label="Accept"
          checked={checked}
          required
          onCheckedChange={setChecked}
        />
      ) : (
        <ShadcnSelect
          label="Role"
          value={value}
          required
          onValueChange={setValue}
          items={[{ value: 'viewer', label: 'Viewer' }]}
        />
      );
    }
    try {
      render(
        <ShadcnForm label="Profile" onSubmit={submit}>
          <Field />
          <Recovery>
            <AbandonedSibling />
          </Recovery>
          <ShadcnSubmitButton label="Save" />
        </ShadcnForm>,
      );
      const user = userEvent.setup();
      if (kind === 'input') {
        await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');
      } else if (kind === 'checkbox') {
        await user.click(screen.getByRole('checkbox', { name: 'Accept' }));
      } else {
        await user.click(screen.getByRole('combobox', { name: 'Role' }));
        await user.click(screen.getByRole('option', { name: 'Viewer' }));
      }
      await user.click(screen.getByRole('button', { name: 'Save' }));
      await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
    } finally {
      log.mockRestore();
    }
  },
);

it('removes unmounted requirements and preserves other committed fields', async () => {
  const submit = vi.fn();
  function Profile() {
    const [visible, setVisible] = useState(true);
    const [name, setName] = useState('Ada');
    return (
      <ShadcnForm label="Profile" onSubmit={submit}>
        <ShadcnInput
          label="Name"
          name="name"
          value={name}
          required
          onValueChange={setName}
        />
        {visible && (
          <ShadcnInput label="Removed" value="" required onValueChange={vi.fn()} />
        )}
        <button type="button" onClick={() => setVisible(false)}>
          Remove
        </button>
        <ShadcnSubmitButton label="Save" />
      </ShadcnForm>
    );
  }
  const view = render(<Profile />);
  const user = userEvent.setup();
  await user.type(screen.getByRole('textbox', { name: 'Name' }), ' Lovelace');
  await user.click(screen.getByRole('button', { name: 'Remove' }));
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Expected profile form');
  expect([...new FormData(form)]).toEqual([['name', 'Ada Lovelace']]);
});

it.each(['input', 'checkbox', 'select'])(
  'retains committed %s after later conditional recovery',
  async (kind) => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const submit = vi.fn();
    function AddedFields() {
      const [visible, setVisible] = useState(false);
      const [name, setName] = useState('');
      const [checked, setChecked] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setVisible(true)}>
            Add fields
          </button>
          {visible && (
            <>
              {kind === 'input' ? (
                <ShadcnInput
                  label="Added"
                  value={name}
                  required
                  onValueChange={setName}
                />
              ) : kind === 'checkbox' ? (
                <ShadcnCheckbox
                  label="Added"
                  checked={checked}
                  required
                  onCheckedChange={setChecked}
                />
              ) : (
                <ShadcnSelect
                  label="Added"
                  value={name}
                  required
                  onValueChange={setName}
                  items={[{ value: 'viewer', label: 'Viewer' }]}
                />
              )}
              <Recovery>
                <AbandonedSibling />
              </Recovery>
            </>
          )}
        </>
      );
    }
    try {
      render(
        <ShadcnForm label="Profile" onSubmit={submit}>
          <ShadcnInput
            label="Retained"
            value="Ada"
            name="retained"
            onValueChange={vi.fn()}
            required
          />
          <AddedFields />
          <ShadcnSubmitButton label="Save" />
        </ShadcnForm>,
      );
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: 'Add fields' }));
      if (kind === 'input') {
        await user.type(screen.getByRole('textbox', { name: 'Added' }), 'Lovelace');
      } else if (kind === 'checkbox') {
        await user.click(screen.getByRole('checkbox', { name: 'Added' }));
      } else {
        await user.click(screen.getByRole('combobox', { name: 'Added' }));
        await user.click(screen.getByRole('option', { name: 'Viewer' }));
      }
      await user.click(screen.getByRole('button', { name: 'Save' }));
      await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
    } finally {
      log.mockRestore();
    }
  },
);
