import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import type { ChatNode } from '../../schema/chat-messages/action-references.js';
import { ChatNodeView } from './chat-node-view.js';

const message = {
  id: 'answer',
  author: 'Assistant',
  role: 'assistant',
  content: 'Response',
} as const;
const control = { id: 'regenerate', label: 'Regenerate', action: 'regenerate' };

it('dispatches all own action intents with the correct isolated state', async () => {
  const registry = success(createStateRegistry([]));
  const other = success(createStateRegistry([]));
  const remove = vi.fn();
  const regenerate = vi.fn();
  const retry = vi.fn();
  const user = userEvent.setup();
  const attachment: ChatNode = {
    type: 'ChatAttachment',
    name: 'File',
    mediaType: 'text/plain',
    removeAction: 'remove',
  };
  const nodes: ChatNode[] = [
    { type: 'ChatMessage', ...message, actions: [control] },
    {
      type: 'ChatMessages',
      label: 'Chat',
      messages: [{ ...message, actions: [control] }],
      status: 'error',
      retryAction: 'retry',
    },
  ];
  const view = render(
    <ReacdProvider>
      <ChatNodeView
        node={attachment}
        registry={registry}
        actions={{ remove, regenerate, retry }}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Remove File' }));
  expect(remove).toHaveBeenCalledWith({ state: registry });
  expect(remove).not.toHaveBeenCalledWith({ state: other });
  for (const node of nodes) {
    view.rerender(
      <ReacdProvider>
        <ChatNodeView node={node} registry={registry} actions={{ regenerate, retry }} />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Regenerate' }));
  }
  expect(regenerate).toHaveBeenCalledTimes(2);
  await user.click(screen.getByRole('button', { name: 'Retry response' }));
  expect(retry).toHaveBeenCalledWith({ state: registry });
});

it('preserves views and rejects absent or inherited actions', async () => {
  const registry = success(createStateRegistry([]));
  const user = userEvent.setup();
  const inherited = vi.fn();
  const actions = {};
  Object.setPrototypeOf(actions, { inherited });
  const nodes: ChatNode[] = [
    { type: 'ChatAttachment', name: 'File', mediaType: 'text/plain' },
    { type: 'ChatMessage', ...message },
    { type: 'ChatMessages', label: 'Chat', messages: [message] },
    {
      type: 'ChatAttachment',
      name: 'File',
      mediaType: 'text/plain',
      removeAction: 'inherited',
    },
    {
      type: 'ChatAttachment',
      name: 'File',
      mediaType: 'text/plain',
      removeAction: 'missing',
    },
    { type: 'ChatMessage', ...message, actions: [{ ...control, action: 'inherited' }] },
    { type: 'ChatMessage', ...message, actions: [{ ...control, action: 'missing' }] },
  ];
  const view = render(<ReacdProvider />);
  for (const node of nodes) {
    view.rerender(
      <ReacdProvider>
        <ChatNodeView node={node} registry={registry} actions={actions} />
      </ReacdProvider>,
    );
    const button = screen.queryByRole('button');
    if (button !== null) await user.click(button);
  }
  expect(inherited).not.toHaveBeenCalled();
});
