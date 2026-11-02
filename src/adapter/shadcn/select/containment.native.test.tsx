import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ShadcnSelect } from './select.adapter.js';

it('bounds the SDK popup and lets native viewport and text shrink', async () => {
  const label = 'Regional approval and international logistics coordination';
  render(
    <ShadcnSelect
      label="Region"
      value=""
      items={[{ value: 'eu', label }]}
      onValueChange={() => undefined}
    />,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Region' }));
  const popup = screen.getByRole('listbox', { name: 'Region' });
  expect(popup).toHaveStyle({
    maxInlineSize: 'var(--radix-select-content-available-width)',
    minInlineSize: '0',
  });
  expect(popup.className).toContain('[&_[data-radix-select-viewport]]:min-w-0');
  const option = screen.getByRole('option', { name: label });
  expect(option.className).toContain('[&>span:last-child]:[overflow-wrap:anywhere]');
});
