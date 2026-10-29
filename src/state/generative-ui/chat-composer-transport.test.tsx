import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const state = [
  { key: 'draft', kind: 'text', initial: 'Draft', access: 'readWrite' },
  { key: 'status', kind: 'text', initial: 'ready', access: 'readWrite' },
];
const root = {
  type: 'ChatPalette',
  label: 'Generated conversation',
  children: [{ type: 'Text', content: { state: 'draft', mode: 'read' } }],
  prompt: [
    {
      type: 'ChatPrompt',
      label: 'Generated draft',
      value: { state: 'draft', mode: 'readWrite' },
      submitAction: 'send',
      status: { state: 'status', mode: 'read' },
      footer: [{ type: 'ChatPromptSubmit' }],
    },
  ],
};

it('validates all recursive action and binding slots before rendering controls', () => {
  const document = { schemaVersion: '0.2', state, root };
  const view = render(<GenerativeUI document={document} />);
  expect(screen.getByRole('alert')).toHaveTextContent('send');
  expect(screen.queryByRole('textbox')).toBeNull();
  view.rerender(
    <GenerativeUI
      document={{
        ...document,
        root: {
          ...root,
          prompt: [
            {
              ...root.prompt[0],
              footer: [{ type: 'ChatPromptSubmit', retryAction: 'missingRetry' }],
            },
          ],
        },
      }}
      actions={{ send: vi.fn() }}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('missingRetry');
  view.rerender(
    <GenerativeUI
      document={{
        ...document,
        root: {
          ...root,
          prompt: [
            {
              ...root.prompt[0],
              attachments: [
                {
                  id: 'report',
                  name: 'Report',
                  mediaType: 'text/plain',
                  removeAction: 'missing',
                },
              ],
            },
          ],
        },
      }}
      actions={{ send: vi.fn() }}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('missing');
});

it('projects draft state and validates status transitions', async () => {
  const user = userEvent.setup();
  const registry = success(createStateRegistry(state));
  const send = vi.fn();
  render(
    <GenerativeUI
      document={{ schemaVersion: '0.2', state, root }}
      registry={registry}
      actions={{ send }}
    />,
  );
  const draft = screen.getByRole('textbox', { name: 'Generated draft' });
  await user.type(draft, '!');
  expect(screen.getByText('Draft!', { selector: 'p' })).toBeVisible();
  await user.keyboard('{Enter}');
  expect(send).toHaveBeenCalledExactlyOnceWith({ state: registry });
  expect(registry.update('status', 'invalid').success).toBe(false);
  expect(success(registry.read('status')).value).toBe('ready');
});
