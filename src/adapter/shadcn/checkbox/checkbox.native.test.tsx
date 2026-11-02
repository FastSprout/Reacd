import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnCheckbox } from './checkbox.adapter.js';

it('uses the SDK checkbox state and label association', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnCheckbox label="Summary" checked={false} onCheckedChange={change} />,
  );
  const checkbox = screen.getByRole('checkbox', { name: 'Summary' });
  expect(checkbox.className).toContain('border-primary');
  await userEvent.click(checkbox);
  expect(change).toHaveBeenCalledWith(true);
  change.mockClear();
  view.rerender(
    <ShadcnCheckbox
      label="Summary"
      checked
      description="Weekly mail"
      readOnly
      onCheckedChange={change}
      indeterminate
    />,
  );
  expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  expect(checkbox).toHaveAccessibleDescription('Weekly mail');
  await userEvent.click(checkbox);
  expect(change).not.toHaveBeenCalled();
});
