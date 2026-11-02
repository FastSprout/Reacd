import { LAYOUT_POLICY } from '../../../core/policy.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnChatReasoning } from './chat-reasoning.adapter.js';

it('keeps native disclosure and requests each stream edge once', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnChatReasoning text="Summary" open={false} onOpenChange={change} />,
  );
  expect(screen.getByRole('button', { name: 'Reasoning summary' })).toHaveStyle({
    minBlockSize: `${LAYOUT_POLICY.controlTargetPx}px`,
    minInlineSize: `${LAYOUT_POLICY.controlTargetPx}px`,
  });
  await userEvent.click(screen.getByRole('button', { name: 'Reasoning summary' }));
  expect(change).toHaveBeenCalledWith(true);
  view.rerender(
    <ShadcnChatReasoning
      text="Summary"
      open={false}
      streaming
      autoOpen
      autoClose
      onOpenChange={change}
    />,
  );
  expect(change).toHaveBeenCalledTimes(2);
  view.rerender(
    <ShadcnChatReasoning
      text="Updated"
      open={false}
      streaming
      autoOpen
      autoClose
      onOpenChange={change}
    />,
  );
  expect(change).toHaveBeenCalledTimes(2);
  view.rerender(
    <ShadcnChatReasoning
      text="Updated"
      open
      streaming
      autoOpen
      autoClose
      onOpenChange={change}
    />,
  );
  expect(screen.getByRole('region', { name: 'Reasoning summary' })).toHaveAttribute(
    'aria-busy',
    'true',
  );
  view.rerender(
    <ShadcnChatReasoning text="Updated" open autoClose onOpenChange={change} />,
  );
  expect(change).toHaveBeenLastCalledWith(false);
  view.rerender(
    <ShadcnChatReasoning
      text=""
      label="Details"
      open
      streaming
      autoClose
      onOpenChange={change}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Details' }));
  const count = change.mock.calls.length;
  view.rerender(
    <ShadcnChatReasoning
      text=""
      label="Details"
      open
      autoClose
      onOpenChange={change}
    />,
  );
  expect(change).toHaveBeenCalledTimes(count);
  expect(screen.getByText('No reasoning summary is available.')).toBeVisible();
  view.rerender(
    <ShadcnChatReasoning
      text="Summary"
      open={false}
      streaming
      autoOpen
      disabled
      onOpenChange={change}
    />,
  );
  expect(change).toHaveBeenCalledTimes(count);
  expect(screen.getByRole('button')).toBeDisabled();
});
