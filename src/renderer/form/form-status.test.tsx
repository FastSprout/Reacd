import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { FormSurface } from './form.renderer.js';

it('announces submitting outside the busy form and preserves retry arguments', () => {
  const submit = vi.fn();
  const errors = [{ message: 'Previous attempt failed.' }];
  const view = render(
    <FormSurface label="Contact" onSubmit={submit} submitting errors={errors}>
      <input name="email" defaultValue="owner@example.com" />
      <button type="submit">Save contact</button>
    </FormSurface>,
  );
  const form = screen.getByRole('form', { name: 'Contact' });
  const status = screen.getByRole('status');
  expect(form).toHaveAttribute('aria-busy', 'true');
  expect(status).toHaveTextContent('Submitting Contact');
  expect(status.closest('[aria-busy="true"]')).toBeNull();
  expect(status.closest('[inert]')).toBeNull();
  expect(form.contains(status)).toBe(false);
  expect(form).toHaveAccessibleDescription(/Previous attempt failed/);
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form.');
  expect([...new FormData(form)]).toEqual([['email', 'owner@example.com']]);
  fireEvent.submit(form);
  expect(submit).not.toHaveBeenCalled();
  view.rerender(
    <FormSurface label="Contact" onSubmit={submit} submitting={false} errors={errors}>
      <input name="email" defaultValue="owner@example.com" />
      <button type="submit">Save contact</button>
    </FormSurface>,
  );
  expect(screen.queryByRole('status')).toBeNull();
  expect(form).not.toHaveAttribute('aria-busy');
  expect(form).toHaveAccessibleDescription(/Previous attempt failed/);
  fireEvent.submit(form);
  expect(submit.mock.calls).toEqual([[]]);
});
