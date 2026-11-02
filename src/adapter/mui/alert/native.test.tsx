import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiAlert } from './alert.adapter.js';
it('uses Material Alert and logical action/dismissal callbacks', async () => {
  const dismiss = vi.fn<(open: boolean) => void>();
  const action = vi.fn<() => void>();
  render(
    <MuiAlert
      title="Retry upload"
      message="Connection failed"
      intent="error"
      open
      onOpenChange={dismiss}
      actions={[{ id: 'retry', label: 'Retry', onPress: action }]}
    />,
  );
  expect(screen.getByRole('alert').className).toContain('MuiAlert-root');
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(action).toHaveBeenCalledWith();
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(dismiss).toHaveBeenCalledWith(false);
});

it('supports passive severity, custom icons and controlled hidden state', () => {
  const view = render(
    <MuiAlert title="Notice" message="Saved" intent="info" icon="info" />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Saved');
  view.rerender(
    <MuiAlert title="Notice" message="Saved" intent="success" open={false} />,
  );
  expect(screen.queryByRole('alert')).toBeNull();
});

it('disables destructive actions and dismissal in inactive content', () => {
  render(
    <PortalActiveContext value={false}>
      <MuiAlert
        title="Delete"
        message="Confirm deletion"
        intent="warning"
        closeLabel="Dismiss"
        onOpenChange={() => undefined}
        actions={[
          { id: 'delete', label: 'Delete', intent: 'danger', onPress: () => undefined },
        ]}
      />
    </PortalActiveContext>,
  );
  expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
  expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
});
