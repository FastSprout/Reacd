import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { FormPendingContext } from '../../../renderer/form/interaction-context.js';
import { ShadcnFormContent } from '../form/form-content.js';
import { ShadcnInput } from '../input/input.adapter.js';
import { ShadcnAccordion } from './accordion.adapter.js';

function formElement() {
  const form = screen.getByRole('form', { name: 'Profile' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form.');
  return form;
}

it.each([false, true])(
  'excludes retained closed fields while pending=%s preserves expanded values',
  async (submitting) => {
    const submit = vi.fn();
    const change = vi.fn();
    render(
      <ShadcnFormContent label="Profile" onSubmit={submit} submitting={submitting}>
        <ShadcnAccordion label="Details" value={['active']} retainContent
          onValueChange={change} items={[
            { value: 'active', label: 'Contact', content: <ShadcnInput
              label="Display name" name="name" value="Ada" required
              onValueChange={() => undefined} /> },
            { value: 'closed', label: 'Billing', content: <ShadcnInput
              label="Billing address" name="billing" value="" required
              onValueChange={() => undefined} /> },
          ]} />
      </ShadcnFormContent>,
    );
    const form = formElement();
    expect([...new FormData(form)]).toEqual([['name', 'Ada']]);
    expect(form.checkValidity()).toBe(true);
    expect(screen.getByRole('textbox', { name: 'Billing address', hidden: true }))
      .toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Display name' }))
      .not.toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Billing' }));
    expect(change).toHaveBeenCalledTimes(submitting ? 0 : 1);
    fireEvent.submit(form);
    if (submitting) {
      await waitFor(() => expect(form).toHaveAttribute('aria-busy', 'true'));
      expect(submit).not.toHaveBeenCalled();
    } else {
      await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
    }
  },
);

it('keeps expanded descendants excluded under an inactive retained ancestor', () => {
  render(
    <ShadcnFormContent label="Profile" onSubmit={() => undefined}>
      <PortalActiveContext value={false}>
        <ShadcnAccordion label="Outer" value={['outer']} retainContent
          onValueChange={() => undefined} items={[
            { value: 'outer', label: 'Outer details', content:
              <ShadcnAccordion label="Inner" value={['inner']} retainContent
                onValueChange={() => undefined} items={[
                  { value: 'inner', label: 'Inner details', content: <ShadcnInput
                    label="Inactive name" name="inactive" value="Hidden" required
                    onValueChange={() => undefined} /> },
                ]} /> },
          ]} />
      </PortalActiveContext>
    </ShadcnFormContent>,
  );
  expect([...new FormData(formElement())]).toEqual([]);
  expect(screen.getByRole('textbox', { name: 'Inactive name' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Inner details' })).toBeDisabled();
});

it('blocks SDK disclosure triggers under inherited pending without a form wrapper',
  () => {
    const change = vi.fn();
    render(<FormPendingContext value={true}>
      <ShadcnAccordion label="Details" value={[]} onValueChange={change}
        mode="multiple" items={[
          { value: 'one', label: 'One', content: 'Retained detail' },
        ]} />
    </FormPendingContext>);
    const trigger = screen.getByRole('button', { name: 'One' });
    expect(trigger).toBeDisabled();
    fireEvent.click(trigger);
    expect(change).not.toHaveBeenCalled();
  },
);

it('retains field nodes and switches native and RHF participation with host values',
  async () => {
    const submit = vi.fn();
    const content = (value: readonly string[]) => (
      <ShadcnFormContent label="Profile" onSubmit={submit}>
        <ShadcnAccordion label="Details" value={value} retainContent
          onValueChange={() => undefined} disabled items={[
            { value: 'contact', label: 'Contact', content: <ShadcnInput
              label="Contact name" name="contact" value="Ada" required
              onValueChange={() => undefined} /> },
            { value: 'billing', label: 'Billing', content: <ShadcnInput
              label="Required billing" name="billing" value="" required
              onValueChange={() => undefined} /> },
          ]} />
      </ShadcnFormContent>
    );
    const view = render(content(['contact']));
    const contact = screen.getByLabelText('Contact name');
    const billing = screen.getByLabelText('Required billing');
    expect([...new FormData(formElement())]).toEqual([['contact', 'Ada']]);
    expect(screen.getByRole('button', { name: 'Contact' })).toBeDisabled();
    expect(contact).not.toBeDisabled();
    view.rerender(content(['billing']));
    expect(screen.getByLabelText('Contact name')).toBe(contact);
    expect(screen.getByLabelText('Required billing')).toBe(billing);
    expect(contact).toBeDisabled();
    expect([...new FormData(formElement())]).toEqual([['billing', '']]);
    expect(formElement().checkValidity()).toBe(false);
    fireEvent.submit(formElement());
    await waitFor(() => expect(billing).toHaveAttribute('aria-invalid', 'true'));
    expect(submit).not.toHaveBeenCalled();
    view.rerender(content(['contact']));
    expect(screen.getByLabelText('Contact name')).toBe(contact);
    expect(formElement().checkValidity()).toBe(true);
    fireEvent.submit(formElement());
    await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
  },
);
