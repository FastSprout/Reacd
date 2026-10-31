import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import type { GenerativeActionContext } from './generative-ui.props.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const state = [{ key: 'done', kind: 'boolean', initial: false, access: 'readWrite' }];
const message = {
  id: 'response',
  author: 'Assistant',
  role: 'assistant',
  content: 'Response',
};
const document = {
  schemaVersion: '0.2',
  state,
  root: {
    type: 'VStack',
    children: [
      {
        type: 'ChatAttachment',
        name: 'File',
        mediaType: 'text/plain',
        removeAction: 'run',
      },
      {
        type: 'ChatMessage',
        ...message,
        actions: [{ id: 'retry', label: 'Regenerate single', action: 'run' }],
      },
      {
        type: 'ChatMessages',
        label: 'Conversation',
        status: 'error',
        retryAction: 'run',
        messages: [
          {
            ...message,
            actions: [{ id: 'retry', label: 'Regenerate nested', action: 'run' }],
          },
        ],
      },
    ],
  },
};

it('renders complete transport and dispatches every nested host action', async () => {
  const registry = success(createStateRegistry(state));
  const user = userEvent.setup();
  const handler = vi.fn(({ state: current }: GenerativeActionContext) => {
    current.update('done', true);
  });
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={document}
      registry={registry}
      actions={{ run: handler }}
    />,
  );
  for (const label of [
    'Remove File',
    'Regenerate single',
    'Regenerate nested',
    'Retry response',
  ])
    await user.click(screen.getByRole('button', { name: label }));
  expect(handler).toHaveBeenCalledTimes(4);
  expect(handler).toHaveBeenCalledWith({ state: registry });
  expect(success(registry.read('done')).value).toBe(true);
});

it('rejects unregistered nested intents before exposing transcript controls', () => {
  render(<GenerativeUI adapter={shadcnAdapter} document={document} />);
  expect(screen.getByRole('alert')).toHaveTextContent('Action is not registered: run.');
  expect(screen.queryByRole('button')).toBeNull();
});
