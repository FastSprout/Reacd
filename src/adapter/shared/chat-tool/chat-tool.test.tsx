import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SharedChatTool } from './chat-tool.adapter.js';

it('keeps all tool statuses textual and details escaped', () => {
  const change = vi.fn();
  const view = render(
    <SharedChatTool
      label="Read reference"
      status="pending"
      open
      onOpenChange={change}
    />,
  );
  expect(screen.getByText('Pending')).toBeVisible();
  expect(screen.getByText('No tool details are available.')).toBeVisible();
  for (const [status, label] of [
    ['running', 'Running'],
    ['approval', 'Awaiting approval'],
    ['success', 'Completed'],
    ['error', 'Failed'],
  ] as const) {
    view.rerender(
      <SharedChatTool
        label="Read reference"
        status={status}
        open
        onOpenChange={change}
        input="Requested input"
        output="<script>Never executed</script>"
        error="Example detail"
      />,
    );
    expect(screen.getByText(label, { exact: true })).toBeVisible();
    expect(screen.getByText('Requested input')).toBeVisible();
    expect(screen.getByText('<script>Never executed</script>')).toBeVisible();
    expect(screen.getByText('Example detail')).toBeVisible();
    expect(view.container.querySelector('script')).toBeNull();
  }
});

it('requests decisions explicitly and protects disabled controls', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const approve = vi.fn();
  const reject = vi.fn();
  const retry = vi.fn();
  const view = render(
    <SharedChatTool
      label="Read reference"
      status="approval"
      open={false}
      onOpenChange={change}
      onApprove={approve}
      onReject={reject}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Read reference' }));
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
  expect(screen.queryByText('No tool details are available.')).toBeNull();
  const approveButton = screen.getByRole('button', { name: 'Approve tool request' });
  approveButton.focus();
  await user.keyboard('{Enter}');
  await user.click(screen.getByRole('button', { name: 'Reject tool request' }));
  expect(approve).toHaveBeenCalledExactlyOnceWith();
  expect(reject).toHaveBeenCalledExactlyOnceWith();
  expect(screen.getByText('Awaiting approval')).toBeVisible();
  view.rerender(
    <SharedChatTool
      label="Read reference"
      status="approval"
      open={false}
      onOpenChange={change}
      onApprove={approve}
      onReject={reject}
      disabled
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Approve tool request' }));
  expect(approve).toHaveBeenCalledOnce();
  view.rerender(
    <SharedChatTool
      label="Read reference"
      status="approval"
      open={false}
      onOpenChange={change}
      onApprove={approve}
    />,
  );
  expect(screen.queryByRole('group', { name: 'Tool approval' })).toBeNull();
  view.rerender(
    <SharedChatTool
      label="Read reference"
      status="error"
      open={false}
      onOpenChange={change}
      onRetry={retry}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Retry tool request' }));
  expect(retry).toHaveBeenCalledExactlyOnceWith();
});
