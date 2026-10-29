import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { ChatComposerNodeView } from './chat-composer-node-view.js';
import { success } from '../../../test-support/data-table.js';

const definitions = [
  { key: 'draft', kind: 'text', initial: 'Draft', access: 'readWrite' },
  { key: 'status', kind: 'text', initial: 'ready', access: 'readWrite' },
];
const prompt = {
  type: 'ChatPrompt',
  label: 'Bound draft',
  value: { state: 'draft', mode: 'readWrite' },
  submitAction: 'send',
} as const;

it('writes isolated drafts and dispatches explicit actions', async () => {
  const user = userEvent.setup();
  const registry = success(createStateRegistry(definitions));
  const other = success(createStateRegistry(definitions));
  const send = vi.fn();
  const stop = vi.fn();
  const retry = vi.fn();
  const remove = vi.fn();
  const node = {
    ...prompt,
    status: { state: 'status', mode: 'read' },
    stopAction: 'stop',
    retryAction: 'retry',
    closeAction: 'close',
    attachments: [
      { id: 'file', name: 'Report', mediaType: 'text/plain', removeAction: 'remove' },
      { id: 'fixed', name: 'Fixed report', mediaType: 'text/plain' },
    ],
  } as const;
  const view = render(
    <ReacdProvider>
      <ChatComposerNodeView
        node={{ ...node, attachments: [...node.attachments] }}
        registry={registry}
        actions={{ send, stop, retry, remove }}
        renderChild={() => null}
      />
    </ReacdProvider>,
  );
  const draft = screen.getByRole('textbox', { name: 'Bound draft' });
  await user.type(draft, '!');
  expect(success(registry.read('draft')).value).toBe('Draft!');
  expect(success(other.read('draft')).value).toBe('Draft');
  await user.click(screen.getByRole('button', { name: 'Send message' }));
  expect(send).toHaveBeenCalledExactlyOnceWith({ state: registry });
  await user.click(screen.getByRole('button', { name: 'Remove Report' }));
  expect(remove).toHaveBeenCalledExactlyOnceWith({ state: registry });
  expect(screen.queryByRole('button', { name: 'Remove Fixed report' })).toBeNull();
  act(() => {
    registry.update('status', 'streaming');
  });
  await user.click(screen.getByRole('button', { name: 'Stop response' }));
  expect(stop).toHaveBeenCalledExactlyOnceWith({ state: registry });
  act(() => {
    registry.update('status', 'error');
  });
  await user.click(screen.getByRole('button', { name: 'Retry response' }));
  expect(retry).toHaveBeenCalledExactlyOnceWith({ state: registry });
  view.rerender(
    <ReacdProvider>
      <ChatComposerNodeView
        node={{ ...prompt, value: { state: 'draft', mode: 'read' } }}
        registry={registry}
        actions={{ send }}
        renderChild={() => null}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
});

it('protects invalid drafts and unavailable actions', async () => {
  const user = userEvent.setup();
  const registry = success(createStateRegistry(definitions));
  const inherited = vi.fn();
  const actions = {};
  Object.setPrototypeOf(actions, { send: inherited });
  const view = render(
    <ReacdProvider>
      <ChatComposerNodeView
        node={prompt}
        registry={registry}
        actions={actions}
        renderChild={() => null}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Send message' }));
  expect(inherited).not.toHaveBeenCalled();
  view.rerender(
    <ReacdProvider>
      <ChatComposerNodeView
        node={{ ...prompt, value: { state: 'missing', mode: 'readWrite' } }}
        registry={registry}
        actions={{}}
        renderChild={() => null}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('missing');
  const send = vi.fn();
  view.rerender(
    <ReacdProvider>
      <ChatComposerNodeView
        node={{ type: 'ChatPromptSubmit', submitAction: 'send' }}
        registry={registry}
        actions={{ send }}
        renderChild={() => null}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Send message' }));
  expect(send).toHaveBeenCalledExactlyOnceWith({ state: registry });
  view.rerender(
    <ReacdProvider>
      <ChatComposerNodeView
        node={{
          type: 'ChatPalette',
          label: 'Transport palette',
          children: ['Transcript'],
          prompt: ['Prompt'],
        }}
        registry={registry}
        actions={{}}
        renderChild={(child) => child}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('region', { name: 'Transport palette' })).toHaveTextContent(
    'TranscriptPrompt',
  );
  view.rerender(
    <ReacdProvider>
      <ChatComposerNodeView
        node={{ type: 'ChatPalette', label: 'Empty palette', children: [] }}
        registry={registry}
        actions={{}}
        renderChild={() => null}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('region', { name: 'Empty palette' })).toBeVisible();
});
