import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { FormPendingContext } from '../../../renderer/form/interaction-context.js';
import { MuiForm } from './form.adapter.js';
import { MuiInput } from '../input/input.adapter.js';
import { MuiButton } from '../button/button.adapter.js';
import { MuiTabs } from '../tabs/tabs.adapter.js';

function contactForm() {
  const form = screen.getByRole('form', { name: 'Contact' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form.');
  return form;
}

it.each([false, true])(
  'preserves participating values and excludes closed fields when pending=%s',
  (submitting) => {
    const change = vi.fn<(value: string) => void>();
    const press = vi.fn<() => void>();
    const submit = vi.fn<() => void>();
    const tab = vi.fn<(value: string) => void>();
    render(
      <MuiForm label="Contact" onSubmit={submit} submitting={submitting}>
        <MuiInput
          label="Company"
          name="company"
          value="Acme"
          required
          onValueChange={change}
        />
        <PortalActiveContext value={false}>
          <MuiInput
            label="Closed"
            name="closed"
            value=""
            required
            onValueChange={change}
          />
        </PortalActiveContext>
        <MuiInput
          label="Disabled"
          name="disabled"
          value="Excluded"
          disabled
          onValueChange={change}
        />
        <MuiTabs
          label="Views"
          value="one"
          onValueChange={tab}
          items={[
            {
              value: 'one',
              label: 'First',
              content: (
                <MuiInput
                  label="Active"
                  name="active"
                  value="Kept"
                  onValueChange={change}
                />
              ),
            },
            {
              value: 'two',
              label: 'Second',
              content: (
                <MuiInput
                  label="Inactive"
                  name="inactive"
                  value=""
                  required
                  onValueChange={change}
                />
              ),
            },
            { value: 'three', label: 'Unavailable', disabled: true, content: null },
          ]}
        />
        <MuiButton label="Apply" onPress={press} />
      </MuiForm>,
    );
    const form = contactForm();
    expect([...new FormData(form)]).toEqual([
      ['company', 'Acme'],
      ['active', 'Kept'],
    ]);
    expect(form.checkValidity()).toBe(true);
    expect(screen.getByRole('textbox', { name: 'Closed' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Disabled' })).toBeDisabled();
    expect(screen.getByRole('tab', { name: 'Unavailable' })).toBeDisabled();
    fireEvent.change(screen.getByRole('textbox', { name: 'Company' }), {
      target: { value: 'Changed' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Second' }));
    fireEvent.submit(form);
    for (const callback of [change, press, tab, submit]) {
      expect(callback).toHaveBeenCalledTimes(submitting ? 0 : 1);
    }
  },
);

it('inherits pending protection without removing visible form values', () => {
  const change = vi.fn<(value: string) => void>();
  const press = vi.fn<() => void>();
  const submit = vi.fn<() => void>();
  render(
    <FormPendingContext value={true}>
      <MuiForm label="Contact" onSubmit={submit}>
        <MuiInput label="Company" name="company" value="Acme" onValueChange={change} />
        <MuiButton label="Apply" onPress={press} />
      </MuiForm>
    </FormPendingContext>,
  );
  const form = contactForm();
  expect([...new FormData(form)]).toEqual([['company', 'Acme']]);
  expect(screen.getByRole('textbox', { name: 'Company' })).not.toBeDisabled();
  expect(form.querySelector('fieldset')).toHaveAttribute('inert');
  fireEvent.change(screen.getByRole('textbox', { name: 'Company' }), {
    target: { value: 'Changed' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
  fireEvent.submit(form);
  expect(change).not.toHaveBeenCalled();
  expect(press).not.toHaveBeenCalled();
  expect(submit).not.toHaveBeenCalled();
});

it.each(['inactive', 'disabled'])(
  'does not restore excluded ancestor %s data during submission',
  (reason) => {
    const change = vi.fn<(value: string) => void>();
    render(
      <PortalActiveContext value={reason !== 'inactive'}>
        <MuiForm
          label="Contact"
          onSubmit={() => undefined}
          disabled={reason === 'disabled'}
          submitting
        >
          <MuiInput
            label="Company"
            name="company"
            value="Acme"
            disabled={false}
            onValueChange={change}
          />
        </MuiForm>
      </PortalActiveContext>,
    );
    expect([...new FormData(contactForm())]).toEqual([]);
    const input = screen.getByRole('textbox', { name: 'Company' });
    expect(input).toBeDisabled();
    fireEvent.change(input, { target: { value: 'Changed' } });
    expect(change).not.toHaveBeenCalled();
  },
);
