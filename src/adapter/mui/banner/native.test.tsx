import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { FormPendingContext } from '../../../renderer/form/interaction-context.js';
import { MuiBanner } from './banner.adapter.js';

it.each(['info', 'success', 'warning', 'error'] as const)(
  'uses actual native %s feedback with controlled dismissal',
  async (intent) => {
    const change = vi.fn(() => false);
    const view = render(
      <MuiBanner
        title="Maintenance"
        description="Save work"
        intent={intent}
        open
        onOpenChange={change}
        dismissible
        closeLabel="Hide notice"
        actions="Notice actions"
      />,
    );
    const feedback = screen.getByRole(
      intent === 'warning' || intent === 'error' ? 'alert' : 'status',
      { name: 'Maintenance' },
    );
    expect(feedback.className).toContain('MuiAlert-root');
    expect(screen.getByText('Save work')).toBeVisible();
    expect(screen.getByText('Notice actions')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Hide notice' }));
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
    expect(feedback).toBeVisible();
    view.rerender(<MuiBanner title="Maintenance" open={false} onOpenChange={change} />);
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  },
);

it(
  'defaults to a persistent information notice and protects pending dismissal',
  async () => {
  const change = vi.fn();
  const view = render(<MuiBanner title="Update" open onOpenChange={change} />);
  expect(screen.getByRole('status', { name: 'Update' })).toBeVisible();
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(
    <FormPendingContext value={true}>
      <MuiBanner title="Update" open dismissible onOpenChange={change} />
    </FormPendingContext>,
  );
  const close = screen.getByRole('button', { name: 'Dismiss banner' });
  expect(close).toBeDisabled();
  fireEvent.click(close);
  expect(change).not.toHaveBeenCalled();
});
