import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiButton } from './button.adapter.js';

it('preserves icon action labels and busy states through IconButton', async () => {
  const press = vi.fn();
  const view = render(<MuiButton
    label="Appearance" leadingIcon="appearance" iconOnly onPress={press}
  />);
  const button = screen.getByRole('button', { name: 'Appearance' });
  expect(button.className).toContain('MuiIconButton-root');
  await userEvent.click(button);
  expect(press).toHaveBeenCalledWith();
  view.rerender(<MuiButton
    label="Appearance" iconOnly onPress={press} intent="danger"
    trailingIcon="layout" loading loadingLabel="Applying appearance"
  />);
  expect(screen.getByRole('button', { name: 'Applying appearance' })).toBeDisabled();
  view.rerender(<MuiButton
    label="Appearance" iconOnly onPress={press} leadingIcon="appearance" loading
  />);
  expect(screen.getByRole('button', { name: 'Appearance' })).toBeDisabled();
});

it('uses Material Button and emits only the logical press', async () => {
  const press = vi.fn<() => void>();
  const view = render(<MuiButton label="Save" onPress={press} intent="danger" />);
  const button = screen.getByRole('button', { name: 'Save' });
  expect(button.className).toContain('MuiButton-root');
  await userEvent.click(button);
  expect(press).toHaveBeenCalledWith();
  view.rerender(
    <MuiButton label="Save" onPress={press} loading loadingLabel="Saving" />,
  );
  expect(screen.getByRole('button', { name: /Saving/ })).toBeDisabled();
  expect(screen.getByRole('progressbar')).toBeVisible();
});

it('supports native outline, error and icon slots with loading labels', () => {
  const view = render(
    <MuiButton
      label="Export"
      onPress={() => undefined}
      intent="secondary"
      leadingIcon="download"
      trailingIcon="external"
    />,
  );
  expect(screen.getByRole('button').className).toContain('MuiButton-outlined');
  expect(view.container.querySelectorAll('.MuiSvgIcon-root')).toHaveLength(2);
  view.rerender(<MuiButton label="Export" onPress={() => undefined} loading />);
  expect(screen.getByRole('button').textContent).toContain('Export');
});
