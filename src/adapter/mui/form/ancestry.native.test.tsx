import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createPortal } from 'react-dom';
import { useLayoutEffect } from 'react';
import { expect, it, vi } from 'vitest';
import { Form, Modal, ReacdProvider, SubmitButton } from '../../../index.js';
import { muiAdapter } from '../mui.adapter.js';
import { MuiForm } from './form.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';

it('rejects native host ancestry before mounting form content', () => {
  const mounted = vi.fn();
  const submit = vi.fn();
  const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  function Content() {
    useLayoutEffect(mounted, []);
    return <MuiSubmitButton label="Save nested" />;
  }
  const host = document.createElement('form');
  host.setAttribute('aria-label', 'Host form');
  document.body.append(host);
  try {
    const view = render(
      <MuiForm label="Nested" onSubmit={submit}>
        <Content />
      </MuiForm>,
      { container: host },
    );
    expect(host.querySelector('form')).toBeNull();
    expect(mounted).not.toHaveBeenCalled();
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('MuiAlert-root');
    expect(alert).toHaveTextContent('Forms cannot be nested.');
    fireEvent.submit(host);
    expect(submit).not.toHaveBeenCalled();
    expect(errors).not.toHaveBeenCalled();
    view.unmount();
  } finally {
    host.remove();
    errors.mockRestore();
  }
});

it('accepts a separate portal form and rejects its physically nested child', () => {
  const outer = vi.fn();
  const portal = vi.fn();
  const nested = vi.fn();
  const host = document.createElement('div');
  document.body.append(host);
  try {
    const view = render(
      <MuiForm label="Outer" onSubmit={outer}>
        {createPortal(
          <MuiForm label="Portal" onSubmit={portal}>
            <MuiForm label="Invalid child" onSubmit={nested} />
            <MuiSubmitButton label="Save portal" />
          </MuiForm>,
          host,
        )}
      </MuiForm>,
    );
    const form = screen.getByRole('form', { name: 'Portal' });
    expect(screen.getAllByRole('form')).toHaveLength(2);
    expect(screen.getByRole('form', { name: 'Outer' }).contains(form)).toBe(false);
    expect(within(form).getByRole('alert')).toHaveTextContent(
      'Forms cannot be nested.',
    );
    fireEvent.submit(form);
    expect(portal).toHaveBeenCalledExactlyOnceWith();
    expect(outer).not.toHaveBeenCalled();
    expect(nested).not.toHaveBeenCalled();
    view.unmount();
  } finally {
    host.remove();
  }
});

it('submits a closed Form independently through native Material Modal', async () => {
  const outer = vi.fn();
  const inner = vi.fn();
  render(
    <ReacdProvider adapter={muiAdapter}>
      <Form label="Outer profile" onSubmit={outer}>
        <Modal
          title="Edit profile"
          description="Independent profile form"
          open
          onOpenChange={vi.fn()}
        >
          <Form label="Modal profile" onSubmit={inner}>
            <SubmitButton label="Save profile" />
          </Form>
        </Modal>
      </Form>
    </ReacdProvider>,
  );
  const dialog = await screen.findByRole('dialog', { name: 'Edit profile' });
  expect(dialog.className).toContain('MuiDialog-paper');
  const form = within(dialog).getByRole('form', { name: 'Modal profile' });
  expect(form.closest('.MuiDialog-root')).not.toBeNull();
  expect(screen.queryByRole('alert')).toBeNull();
  await userEvent.click(within(form).getByRole('button', { name: 'Save profile' }));
  await waitFor(() => expect(inner).toHaveBeenCalledExactlyOnceWith());
  expect(outer).not.toHaveBeenCalled();
});
