import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnDropdownMenu } from './dropdown-menu.adapter.js';
import { DropdownMenu, DropdownMenuTrigger } from '../vendor/ui/dropdown-menu.js';

it('uses the official native Menu trigger activation API', async () => {
  const change = vi.fn();
  render(
    <DropdownMenu open={false} onOpenChange={change}>
      <DropdownMenuTrigger>Native settings</DropdownMenuTrigger>
    </DropdownMenu>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Native settings' }));
  await waitFor(() => expect(change).toHaveBeenCalled());
});

it('forwards a native trigger request without exposing SDK event details', async () => {
  const change = vi.fn();
  render(
    <ShadcnDropdownMenu
      label="Open settings"
      open={false}
      onOpenChange={change}
      items={[]}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Open settings' }));
  await waitFor(() => expect(change).toHaveBeenCalledExactlyOnceWith(true));
});
