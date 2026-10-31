import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider, Toast } from '../../../index.js';

function Example() {
  const [open, setOpen] = useState(true);
  return (
    <Toast
      title="Record saved"
      description="The local record is ready."
      open={open}
      onOpenChange={setOpen}
      duration="persistent"
    />
  );
}
describe('declarative toast', () => {
  it('announces a notification and closes controlled state', async () => {
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Example />
      </ReacdProvider>,
    );
    const toast = await screen.findByRole('dialog', { name: 'Record saved' });
    expect(toast).toHaveAccessibleDescription('The local record is ready.');
    fireEvent.keyDown(toast, { key: 'ArrowDown' });
    expect(toast).toBeVisible();
    fireEvent.keyDown(window, { key: 'F6' });
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', {
          name: 'Record saved',
        }),
      ).toBeNull(),
    );
  });
});
it('preserves host vetoes and passes only the logical close value', async () => {
  const onOpenChange = vi.fn(() => false);
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Toast
        title="Vetoed notice"
        open
        onOpenChange={onOpenChange}
        duration="persistent"
      />
    </ReacdProvider>,
  );
  const toast = await screen.findByRole('dialog', { name: 'Vetoed notice' });
  fireEvent.keyDown(window, { key: 'F6' });
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
  expect(onOpenChange.mock.calls).toEqual([[false]]);
  expect(await screen.findByRole('dialog', { name: 'Vetoed notice' })).toBeVisible();
  expect(toast).toHaveTextContent('The notification change was rejected.');
});
it('keeps notifications open when the host holds its controlled value', async () => {
  const onOpenChange = vi.fn();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Toast
        title="Held notice"
        open
        onOpenChange={onOpenChange}
        duration="persistent"
      />
    </ReacdProvider>,
  );
  await screen.findByRole('dialog', { name: 'Held notice' });
  fireEvent.keyDown(window, { key: 'F6' });
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(await screen.findByRole('dialog', { name: 'Held notice' })).toBeVisible();
});
it('runs zero-argument actions, honors veto and reports runtime failures', async () => {
  const { toastActionSchema } = await import('../../../schema/toast/toast.schema.js');
  const onOpenChange = vi.fn();
  const action = vi.fn<() => boolean | void>(() => false);
  const { rerender } = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Toast
        title="Action notice"
        open
        onOpenChange={onOpenChange}
        action={{ label: 'Undo', onPress: action }}
      />
    </ReacdProvider>,
  );
  await screen.findByRole('dialog', { name: 'Action notice' });
  fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
  expect(action.mock.calls).toEqual([[]]);
  expect(onOpenChange).not.toHaveBeenCalled();
  expect(screen.getByRole('status')).toHaveTextContent('change was rejected');
  action.mockImplementationOnce(() => {
    throw new Error('Unavailable backend');
  });
  fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
  expect(screen.getByRole('alert')).toHaveTextContent('notification action failed');
  const invalid = toastActionSchema.parse({ label: 'Invalid', onPress: () => 'wrong' });
  rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <Toast title="Action notice" open onOpenChange={onOpenChange} action={invalid} />
    </ReacdProvider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Invalid' }));
  expect(screen.getByRole('alert')).toHaveTextContent('callbacks must return');
});
it('supports logical action closure policies', async () => {
  const onOpenChange = vi.fn();
  const action = vi.fn();
  const { rerender } = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Toast
        title="Action notice"
        open
        onOpenChange={onOpenChange}
        closeOnAction={false}
        action={{ label: 'Apply', onPress: action }}
      />
    </ReacdProvider>,
  );
  await screen.findByRole('dialog', { name: 'Action notice' });
  fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
  expect(onOpenChange).not.toHaveBeenCalled();
  rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <Toast
        title="Action notice"
        open
        onOpenChange={onOpenChange}
        action={{ label: 'Apply', onPress: action }}
      />
    </ReacdProvider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
  expect(onOpenChange).toHaveBeenCalledWith(false);
});
