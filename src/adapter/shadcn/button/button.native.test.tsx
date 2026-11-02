import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnButton } from './button.adapter.js';

it('keeps the accessible name on an icon-only SDK action', async () => {
  const press = vi.fn();
  render(
    <ShadcnButton
      label="Toggle theme"
      onPress={press}
      leadingIcon="settings"
      iconOnly
    />,
  );
  const button = screen.getByRole('button', { name: 'Toggle theme' });
  expect(screen.getByText('Toggle theme').classList.contains('sr-only')).toBe(true);
  await userEvent.click(button);
  expect(press).toHaveBeenCalledOnce();
});

it('uses the official button variants and forwards actions', async () => {
  const press = vi.fn();
  const view = render(<ShadcnButton label="Save" onPress={press} />);
  const button = screen.getByRole('button', { name: 'Save' });
  expect(button.className).toContain('bg-primary');
  await userEvent.click(button);
  expect(press).toHaveBeenCalledOnce();
  expect(press).toHaveBeenCalledWith();
  view.rerender(
    <ShadcnButton
      label="Save"
      intent="danger"
      onPress={press}
      leadingIcon="check"
      trailingIcon="download"
      loading
      loadingLabel="Saving"
    />,
  );
  expect(screen.getByRole('button', { name: 'Saving' })).toBeDisabled();
  expect(button.className).toContain('bg-destructive');
  view.rerender(
    <ShadcnButton label="Save" intent="secondary" onPress={press} disabled loading />,
  );
  expect(button).toBeDisabled();
  expect(button.className).toContain('bg-secondary');
});

it('keeps ordinary actions separate from native form submission', async () => {
  const submit = vi.fn();
  const press = vi.fn();
  render(
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <ShadcnButton label="Action" onPress={press} />
    </form>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Action' }));
  expect(press).toHaveBeenCalledWith();
  expect(submit).not.toHaveBeenCalled();
});
