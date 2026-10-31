import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { createToastQueue } from './toast-queue.js';
import { ToastQueueContext } from './toast-queue-context.js';
import { useEffect } from 'react';
import { Toast as NativeToast } from '@base-ui/react/toast';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '../../../../test-support/adapter-testing.js';
import { expect, it, vi } from 'vitest';
import { App, Modal, ReacdProvider, Toast } from '../../../index.js';
import { TOAST_POLICY } from '../../../core/toast-policy.js';
import { SharedToastViewport } from './toast-viewport.js';
it('keeps one viewport per independent Surface and preserves scoped RTL', async () => {
  render(
    <>
      <ReacdProvider adapter={activeTestAdapter}>
        <App direction="rtl">
          <Toast
            title="First application"
            open
            onOpenChange={vi.fn()}
            duration="persistent"
          />
        </App>
      </ReacdProvider>
      <ReacdProvider adapter={activeTestAdapter}>
        <Toast
          title="Second application"
          open
          onOpenChange={vi.fn()}
          duration="persistent"
        />
      </ReacdProvider>
    </>,
  );
  const first = await screen.findByRole('dialog', { name: 'First application' });
  expect(first).toHaveAttribute('dir', 'rtl');
  expect(screen.getAllByRole('region', { name: 'Notifications' })).toHaveLength(2);
  expect(screen.getByRole('dialog', { name: 'Second application' })).toHaveAttribute(
    'dir',
    'ltr',
  );
});
it('does not register notifications inside inactive retained ancestors', () => {
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <Modal
        title="Closed ancestor"
        description="Retained"
        open={false}
        onOpenChange={vi.fn()}
        retainContent
      >
        <Toast title="Inactive notification" open onOpenChange={vi.fn()} />
      </Modal>
    </ReacdProvider>,
  );
  expect(screen.queryByRole('region', { name: 'Notifications' })).toBeNull();
});
it('portals modal-scoped notifications into an accessible active host', async () => {
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <Modal
        title="Active ancestor"
        description="Current resource"
        open
        onOpenChange={vi.fn()}
      >
        <Toast
          title="Scoped notification"
          open
          onOpenChange={vi.fn()}
          duration="persistent"
        />
      </Modal>
    </ReacdProvider>,
  );
  const dialog = screen.getByRole('dialog', { name: 'Active ancestor' });
  expect(
    await within(dialog).findByRole('dialog', { name: 'Scoped notification' }),
  ).toBeVisible();
});
it('bounds concurrent registrations', async () => {
  const declarations = Array.from(
    { length: TOAST_POLICY.maximumQueued + 1 },
    (_, index) => (
      <Toast
        key={index}
        title={`Notice ${index}`}
        open
        onOpenChange={vi.fn()}
        duration="persistent"
      />
    ),
  );
  const { rerender } = render(
    <ReacdProvider adapter={activeTestAdapter}>{declarations}</ReacdProvider>,
  );
  expect(await screen.findByText('The notification queue is full.')).toBeVisible();
  expect(document.querySelectorAll('.reacd-toast')).toHaveLength(
    TOAST_POLICY.maximumQueued,
  );
  expect(document.querySelectorAll('.reacd-toast[data-limited]')).toHaveLength(
    TOAST_POLICY.maximumQueued - TOAST_POLICY.maximumVisible,
  );
  rerender(
    <ReacdProvider adapter={activeTestAdapter}>{declarations.slice(1)}</ReacdProvider>,
  );
  await waitFor(() =>
    expect(screen.queryByText('The notification queue is full.')).toBeNull(),
  );
  expect(screen.getByText(`Notice ${TOAST_POLICY.maximumQueued}`)).toBeInTheDocument();
});
it('ignores unsupported private records', async () => {
  function Unexpected() {
    const { add } = NativeToast.useToastManager<Record<string, never>>();
    useEffect(() => {
      add({ title: 'Unsupported private record', timeout: 0 });
    }, [add]);
    return null;
  }
  render(
    <ToastQueueContext.Provider value={createToastQueue()}>
      <NativeToast.Provider>
        <Unexpected />
        <SharedToastViewport />
      </NativeToast.Provider>
    </ToastQueueContext.Provider>,
  );
  await waitFor(() => expect(screen.getByRole('region')).toBeInTheDocument());
  expect(screen.queryByText('Unsupported private record')).toBeNull();
});
it('reports invalid close callbacks', async () => {
  const { toastChangeSchema } = await import('../../../schema/toast/toast.schema.js');
  const invalid = toastChangeSchema.parse(() => Promise.resolve());
  const { rerender } = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <Toast title="Invalid close" open duration="persistent" onOpenChange={invalid} />
    </ReacdProvider>,
  );
  await screen.findByRole('dialog', { name: 'Invalid close' });
  fireEvent.keyDown(window, { key: 'F6' });
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
  expect(screen.getByRole('alert')).toHaveTextContent('callbacks must return');
  rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <Toast
        title="Invalid close"
        open
        duration="persistent"
        onOpenChange={() => {
          throw new Error('Callback failure');
        }}
      />
    </ReacdProvider>,
  );
  const toast = screen.getByRole('dialog', { name: 'Invalid close' });
  toast.focus();
  fireEvent.keyDown(toast, { key: 'Escape' });
  expect(screen.getByRole('alert')).toHaveTextContent('notification action failed');
});
