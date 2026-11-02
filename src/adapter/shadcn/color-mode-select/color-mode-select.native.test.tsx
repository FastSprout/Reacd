import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnColorModeSelect } from './color-mode-select.adapter.js';

it('uses SDK preference selection and write permissions', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnColorModeSelect
      label="Appearance"
      value="system"
      resolvedMode="light"
      description="Choose appearance"
      onValueChange={change}
    />,
  );
  expect(screen.getByRole('combobox').className).toContain('border-input');
  expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Choose appearance');
  await userEvent.click(screen.getByRole('combobox'));
  await userEvent.click(screen.getByRole('option', { name: 'Dark' }));
  expect(change).toHaveBeenLastCalledWith('dark');
  view.rerender(
    <form>
      <ShadcnColorModeSelect
        label="Appearance"
        value="dark"
        resolvedMode="dark"
        readOnly
        onValueChange={change}
        labels={{ light: 'Day', dark: 'Night', system: 'Device' }}
      />
    </form>,
  );
  const hidden = view.container.querySelector('select');
  if (!hidden) throw new Error('SDK native select is missing.');
  fireEvent.change(hidden, { target: { value: 'light' } });
  expect(change).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('combobox')).toHaveTextContent('Night');
});
