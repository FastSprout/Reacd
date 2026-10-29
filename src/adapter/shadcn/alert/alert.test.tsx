import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Alert, ReacdProvider } from '../../../index.js';

it('exposes severity and requests controlled actions and dismissal', async () => {
  const user = userEvent.setup();
  const close = vi.fn();
  const action = vi.fn();
  const view = render(
    <ReacdProvider>
      <Alert
        title="Review required"
        message="Check the form."
        intent="warning"
        open
        onOpenChange={close}
        actions={[
          { id: 'review', label: 'Review', onPress: action },
          {
            id: 'blocked',
            label: 'Blocked',
            onPress: action,
            disabled: true,
            intent: 'danger',
          },
        ]}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Check the form.');
  await user.click(screen.getByRole('button', { name: 'Review' }));
  await user.click(screen.getByRole('button', { name: 'Blocked' }));
  expect(action).toHaveBeenCalledExactlyOnceWith();
  await user.click(screen.getByRole('button', { name: 'Dismiss Review required' }));
  expect(close).toHaveBeenLastCalledWith(false);
  expect(screen.getByRole('alert')).toBeInTheDocument();
  view.rerender(
    <ReacdProvider>
      <Alert title="Closed" message="Hidden" intent="error" open={false} />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).toBeNull();
});

it('supports readonly visibility and explicit close labels', () => {
  const view = render(
    <ReacdProvider>
      <Alert title="Saved" message="Changes recorded." intent="success" open />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Saved');
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(
    <ReacdProvider>
      <Alert title="Information" message="Read the guide." intent="info" actions={[]} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Read the guide.');
  expect(view.container.querySelector('.reacd-alert-actions')).toBeNull();
  view.rerender(
    <ReacdProvider>
      <Alert
        title="Error"
        message="Try again."
        intent="error"
        open
        icon="error"
        onOpenChange={() => undefined}
        closeLabel="Dismiss error"
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('button', { name: 'Dismiss error' })).toBeInTheDocument();
});
