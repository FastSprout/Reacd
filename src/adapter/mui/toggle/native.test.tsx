import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiToggle } from './toggle.adapter.js';
it('uses the SDK switch rather than a custom toggle painter', async () => {
  const change = vi.fn<(value: boolean) => void>();
  render(<MuiToggle label="Enabled" checked={false} onCheckedChange={change} />);
  const field = screen.getByRole('switch', { name: 'Enabled' });
  expect(field.closest('.MuiSwitch-root')).not.toBeNull();
  await userEvent.click(field);
  expect(change).toHaveBeenCalledWith(true);
});
