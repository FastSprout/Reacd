import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createPortal } from 'react-dom';
import { expect, it, vi } from 'vitest';
import { FormSurface } from './form.renderer.js';

it('permits zero-argument submission retries with stale summaries', async () => {
  const user = userEvent.setup();
  const submit = vi.fn();
  render(
    <FormSurface
      label="Contact"
      onSubmit={submit}
      errors={[
        { label: 'Network', message: 'Previous attempt failed.' },
        { message: 'Retry is available.' },
      ]}
    >
      <input
        name="email"
        aria-label="Email"
        required
        defaultValue="owner@example.com"
      />
      <button type="submit">Save contact</button>
    </FormSurface>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Previous attempt failed.');
  expect(screen.getByRole('form')).toHaveAccessibleDescription(
    /Previous attempt failed/,
  );
  await user.click(screen.getByRole('button'));
  expect(submit.mock.calls).toEqual([[]]);
  expect(screen.getByRole('alert')).toBeVisible();
});

it('uses native required validity before invoking the public callback', async () => {
  const user = userEvent.setup();
  const submit = vi.fn();
  render(
    <FormSurface label="Required" onSubmit={submit}>
      <input aria-label="Name" required />
      <button type="submit">Save</button>
    </FormSurface>,
  );
  await user.click(screen.getByRole('button'));
  expect(submit).not.toHaveBeenCalled();
  const input = screen.getByRole('textbox');
  if (!(input instanceof HTMLInputElement)) throw new Error('Missing input');
  expect(input.validity.valueMissing).toBe(true);
});

it('guards protected submission and retains enabled values', () => {
  const submit = vi.fn();
  const { rerender } = render(
    <FormSurface label="Busy" onSubmit={submit} submitting>
      <input name="value" defaultValue="canonical" />
      <button type="submit">Save</button>
    </FormSurface>,
  );
  const form = screen.getByRole('form');
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing form');
  expect(form).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByRole('status')).toHaveTextContent('Submitting Busy');
  expect(form.querySelector('[inert]')).not.toBeNull();
  expect([...new FormData(form)]).toEqual([['value', 'canonical']]);
  fireEvent.submit(form);
  expect(submit).not.toHaveBeenCalled();
  rerender(
    <FormSurface label="Busy" onSubmit={submit} disabled>
      <input name="value" defaultValue="canonical" />
      <button type="submit">Save</button>
    </FormSurface>,
  );
  expect(screen.getByRole('textbox')).toBeDisabled();
  expect([...new FormData(form)]).toEqual([]);
  fireEvent.submit(form);
  expect(submit).not.toHaveBeenCalled();
});

it('rejects nested Form surfaces before producing nested native form markup', () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  try {
    const { container } = render(
      <FormSurface label="Outer" onSubmit={vi.fn()}>
        <FormSurface label="Inner" onSubmit={vi.fn()}>
          {null}
        </FormSurface>
      </FormSurface>,
    );
    expect(container.querySelectorAll('form')).toHaveLength(1);
    expect(screen.getByRole('alert')).toHaveTextContent('Forms cannot be nested');
    expect(error).not.toHaveBeenCalled();
  } finally {
    error.mockRestore();
  }
});

it('isolates submission of a physically independent portal form', async () => {
  const user = userEvent.setup();
  const outer = vi.fn();
  const inner = vi.fn();
  const portal = document.createElement('div');
  document.body.appendChild(portal);
  const view = render(
    <FormSurface label="Outer portal host" onSubmit={outer}>
      {createPortal(
        <FormSurface label="Independent form" onSubmit={inner}>
          <button type="submit">Submit independent form</button>
        </FormSurface>,
        portal,
      )}
    </FormSurface>,
  );
  try {
    expect(document.querySelectorAll('form')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Submit independent form' }));
    expect(inner.mock.calls).toEqual([[]]);
    expect(outer).not.toHaveBeenCalled();
  } finally {
    view.unmount();
    portal.remove();
  }
});
