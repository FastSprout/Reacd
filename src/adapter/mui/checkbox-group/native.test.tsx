import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiCheckboxGroup } from './checkbox-group.adapter.js';
it('enforces selection limits with native Material checkboxes', async () => {
  const change = vi.fn<(value: readonly string[]) => void>();
  const items = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
  ];
  const view = render(
    <MuiCheckboxGroup
      label="Digests"
      value={[]}
      items={items}
      onValueChange={change}
      max={1}
      required
    />,
  );
  const daily = screen.getByRole('checkbox', { name: 'Daily' });
  expect(daily.closest('.MuiCheckbox-root')).not.toBeNull();
  await userEvent.click(daily);
  expect(change).toHaveBeenCalledWith(['daily']);
  view.rerender(
    <MuiCheckboxGroup
      label="Digests"
      value={['daily']}
      items={items}
      onValueChange={change}
      max={1}
    />,
  );
  expect(screen.getByRole('checkbox', { name: 'Weekly' })).toBeDisabled();
  await userEvent.click(daily);
  expect(change).toHaveBeenLastCalledWith([]);
});
