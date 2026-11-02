import { DirectionProvider } from '@radix-ui/react-direction';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnSelectMenu } from './select-menu.adapter.js';

it('forwards semantic RTL direction to the native portalled Popup', async () => {
  const change = vi.fn();
  render(
    <DirectionProvider dir="rtl">
      <ShadcnSelectMenu
        label="Owner"
        open
        value=""
        onValueChange={change}
        items={[{ value: 'maya', label: 'Maya Patel' }]}
      />
    </DirectionProvider>,
  );
  const option = await screen.findByRole('option', { name: 'Maya Patel' });
  expect(option.closest('[data-slot="combobox-content"]')).toHaveAttribute(
    'dir',
    'rtl',
  );
  const query = screen.getByRole('combobox', { name: 'Search Owner' });
  query.focus();
  await userEvent.keyboard('{ArrowDown}{Enter}');
  expect(change).toHaveBeenCalledExactlyOnceWith('maya');
});
