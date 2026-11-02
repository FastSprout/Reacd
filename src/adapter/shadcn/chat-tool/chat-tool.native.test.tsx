import { LAYOUT_POLICY } from '../../../core/policy.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnChatTool } from './chat-tool.adapter.js';

it('uses native disclosure and canonical tool decision callbacks', async () => {
  const change = vi.fn();
  const approve = vi.fn();
  const reject = vi.fn();
  const retry = vi.fn();
  const view = render(
    <ShadcnChatTool
      label="Lookup"
      status="approval"
      open
      input="<script>input</script>"
      output="Result"
      onOpenChange={change}
      onApprove={approve}
      onReject={reject}
    />,
  );
  expect(screen.getByText('<script>input</script>')).toBeVisible();
  expect(view.container.querySelector('script')).toBeNull();
  expect(screen.getByRole('button', { name: 'Lookup' })).toHaveStyle({
    minBlockSize: `${LAYOUT_POLICY.controlTargetPx}px`,
    minInlineSize: `${LAYOUT_POLICY.controlTargetPx}px`,
  });
  await userEvent.click(screen.getByRole('button', { name: 'Lookup' }));
  expect(change).toHaveBeenCalledWith(false);
  await userEvent.click(screen.getByRole('button', { name: 'Approve tool request' }));
  await userEvent.click(screen.getByRole('button', { name: 'Reject tool request' }));
  expect(approve).toHaveBeenCalledWith();
  expect(reject).toHaveBeenCalledWith();
  view.rerender(
    <ShadcnChatTool
      label="Lookup"
      status="error"
      open
      error="Failed lookup"
      onOpenChange={change}
      onRetry={retry}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Retry tool request' }));
  expect(retry).toHaveBeenCalledWith();
  view.rerender(
    <ShadcnChatTool
      label="Lookup"
      status="pending"
      open
      onOpenChange={change}
      disabled
    />,
  );
  expect(screen.getByText('No tool details are available.')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Lookup' })).toBeDisabled();
  view.rerender(
    <ShadcnChatTool
      label="Lookup"
      status="running"
      open={false}
      onOpenChange={change}
    />,
  );
  expect(screen.queryByText('No tool details are available.')).toBeNull();
});

it('marks native details busy only while the tool runs', () => {
  const change = vi.fn();
  const view = render(
    <ShadcnChatTool
      label="Lookup"
      status="running"
      open
      output="Partial output"
      onOpenChange={change}
    />,
  );
  const details = screen.getByRole('region', { name: 'Lookup details' });
  expect(details).toHaveAttribute('data-radix-scroll-area-viewport');
  expect(details).toHaveAttribute('aria-busy', 'true');
  view.rerender(
    <ShadcnChatTool
      label="Lookup"
      status="success"
      open
      output="Completed output"
      onOpenChange={change}
    />,
  );
  expect(screen.getByRole('region', { name: 'Lookup details' })).toBe(details);
  expect(details).toHaveAttribute('aria-busy', 'false');
  expect(screen.getByText('Completed output')).toBeVisible();
});
