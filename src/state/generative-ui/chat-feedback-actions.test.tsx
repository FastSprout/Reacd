import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { ChatFeedbackNodeView } from './chat-feedback-node-view.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const definitions = [
  { key: 'expanded', kind: 'boolean', initial: false, access: 'readWrite' },
];
const node = {
  type: 'ChatTool',
  label: 'Read reference',
  status: 'approval',
  open: { state: 'expanded', mode: 'readWrite' },
  approveAction: 'approve',
  rejectAction: 'reject',
} as const;

it('dispatches decisions, disclosure writes and retry explicitly', async () => {
  const registry = success(createStateRegistry(definitions));
  const approve = vi.fn();
  const reject = vi.fn();
  const retry = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChatFeedbackNodeView
        node={node}
        registry={registry}
        actions={{ approve, reject, retry }}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Read reference' }));
  expect(success(registry.read('expanded')).value).toBe(true);
  await user.click(screen.getByRole('button', { name: 'Approve tool request' }));
  await user.click(screen.getByRole('button', { name: 'Reject tool request' }));
  expect(approve).toHaveBeenCalledWith({ state: registry });
  expect(reject).toHaveBeenCalledWith({ state: registry });
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChatFeedbackNodeView
        node={{
          ...node,
          status: 'error',
          approveAction: undefined,
          rejectAction: undefined,
          retryAction: 'retry',
        }}
        registry={registry}
        actions={{ retry }}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Retry tool request' }));
  expect(retry).toHaveBeenCalledWith({ state: registry });
});

it('protects read bindings and ignores absent or inherited decisions', async () => {
  const registry = success(createStateRegistry(definitions));
  const user = userEvent.setup();
  const inherited = vi.fn();
  const actions = {};
  Object.setPrototypeOf(actions, { approve: inherited, reject: inherited });
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChatFeedbackNodeView node={node} registry={registry} actions={actions} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Approve tool request' }));
  await user.click(screen.getByRole('button', { name: 'Reject tool request' }));
  expect(inherited).not.toHaveBeenCalled();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChatFeedbackNodeView
        node={{ ...node, open: { state: 'expanded', mode: 'read' } }}
        registry={registry}
        actions={{}}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('button', { name: 'Approve tool request' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Read reference' })).toBeDisabled();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChatFeedbackNodeView
        node={{ ...node, disabled: true }}
        registry={registry}
        actions={{}}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('button', { name: 'Read reference' })).toBeDisabled();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChatFeedbackNodeView
        node={{ ...node, open: { state: 'missing', mode: 'readWrite' } }}
        registry={registry}
        actions={{}}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('missing');
});
