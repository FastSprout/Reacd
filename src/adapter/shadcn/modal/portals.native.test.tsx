import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnModal } from './modal.adapter.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { ShadcnSelect } from '../select/select.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

it('keeps native child menus inside the active dialog', async () => {
  const change = vi.fn();
  const content = (
    <ShadcnSelect
      label="Role"
      value="reader"
      onValueChange={change}
      items={[
        { value: 'reader', label: 'Reader' },
        { value: 'admin', label: 'Admin' },
      ]}
    />
  );
  const view = render(
    <ShadcnModal
      title="Settings"
      description="Details"
      open
      onOpenChange={vi.fn()}
      retainContent
    >
      {content}
    </ShadcnModal>,
  );
  const dialog = screen.getByRole('dialog');
  expect(dialog.style.overflowY).toBe('auto');
  await userEvent.click(screen.getByRole('combobox', { name: 'Role' }));
  const option = await screen.findByRole('option', { name: 'Admin' });
  expect(dialog.contains(option)).toBe(true);
  view.rerender(
    <ShadcnModal
      title="Settings"
      description="Details"
      open={false}
      onOpenChange={vi.fn()}
      retainContent
    >
      {content}
    </ShadcnModal>,
  );
  await waitFor(() =>
    expect(screen.queryByRole('option', { name: 'Admin' })).toBeNull(),
  );
  view.rerender(
    <ShadcnModal
      title="Settings"
      description="Details"
      open
      onOpenChange={vi.fn()}
      retainContent
    >
      {content}
    </ShadcnModal>,
  );
  expect(screen.queryByRole('option', { name: 'Admin' })).toBeNull();
  expect(change).not.toHaveBeenCalled();
});

it('keeps native portal forms independent of their logical outer form', async () => {
  const outer = vi.fn();
  const inner = vi.fn();
  render(
    <ShadcnForm label="Outer" onSubmit={outer}>
      <ShadcnModal title="Edit" description="Details" open onOpenChange={vi.fn()}>
        <ShadcnForm label="Inner" onSubmit={inner}>
          <ShadcnSubmitButton label="Submit inner" />
        </ShadcnForm>
      </ShadcnModal>
    </ShadcnForm>,
  );
  expect(
    screen
      .getByRole('form', { name: 'Outer', hidden: true })
      .contains(screen.getByRole('form', { name: 'Inner' })),
  ).toBe(false);
  await userEvent.click(screen.getByRole('button', { name: 'Submit inner' }));
  await waitFor(() => expect(inner).toHaveBeenCalledExactlyOnceWith());
  expect(outer).not.toHaveBeenCalled();
});

it('suspends dialogs in an inactive parent scope', async () => {
  const change = vi.fn();
  const dialog = (
    <ShadcnModal
      title="Scoped"
      description="Details"
      open
      triggerLabel="Open scoped"
      onOpenChange={change}
    />
  );
  const view = render(
    <PortalActiveContext.Provider value={true}>{dialog}</PortalActiveContext.Provider>,
  );
  view.rerender(
    <PortalActiveContext.Provider value={false}>{dialog}</PortalActiveContext.Provider>,
  );
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  await userEvent.click(screen.getByRole('button', { name: 'Open scoped' }));
  expect(change).not.toHaveBeenCalled();
});
