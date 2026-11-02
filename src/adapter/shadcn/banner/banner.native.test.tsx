import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnBanner } from './banner.adapter.js';

it('names native status/alert notices and preserves controlled dismissal', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnBanner
      title="Maintenance"
      open
      description="Save work"
      onOpenChange={change}
      dismissible
    />,
  );
  expect(screen.getByRole('status', { name: 'Maintenance' })).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Dismiss banner' }));
  expect(change).toHaveBeenCalledWith(false);
  expect(screen.getByRole('status')).toBeVisible();
  view.rerender(
    <ShadcnBanner title="Warning" intent="warning" open onOpenChange={change} />,
  );
  expect(screen.getByRole('alert', { name: 'Warning' })).toBeVisible();
  view.rerender(
    <ShadcnBanner title="Error" intent="error" open onOpenChange={change} />,
  );
  expect(screen.getByRole('alert', { name: 'Error' })).toBeVisible();
  view.rerender(
    <ShadcnBanner
      title="Success"
      intent="success"
      open={false}
      onOpenChange={change}
    />,
  );
  expect(screen.queryByRole('status')).toBeNull();
});

it('retains complete dismissal labels and native keyboard callback semantics',
  async () => {
    const change = vi.fn();
    const closeLabel = 'Dismiss this workspace announcement';
    render(<ShadcnBanner title="Workspace notice" open dismissible
      closeLabel={closeLabel} onOpenChange={change} />);
    const control = screen.getByRole('button', { name: closeLabel });
    expect(control).toHaveTextContent(closeLabel);
    control.focus();
    await userEvent.keyboard('{Enter}');
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
    expect(screen.getByRole('status', { name: 'Workspace notice' })).toBeVisible();
  },
);
