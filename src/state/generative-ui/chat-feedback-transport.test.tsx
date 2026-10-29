import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const state = [
  { key: 'summary', kind: 'text', initial: 'Example summary', access: 'readWrite' },
  { key: 'expanded', kind: 'boolean', initial: false, access: 'readWrite' },
  { key: 'working', kind: 'boolean', initial: false, access: 'readWrite' },
];
const document = {
  schemaVersion: '0.2',
  state,
  root: {
    type: 'VStack',
    children: [
      {
        type: 'Input',
        label: 'Summary editor',
        value: { state: 'summary', mode: 'readWrite' },
      },
      {
        type: 'ChatReasoning',
        text: { state: 'summary', mode: 'read' },
        open: { state: 'expanded', mode: 'readWrite' },
      },
      {
        type: 'ChatShimmer',
        text: { state: 'summary', mode: 'read' },
        active: { state: 'working', mode: 'read' },
      },
      {
        type: 'ChatTool',
        label: 'Read reference',
        status: 'approval',
        open: { state: 'expanded', mode: 'readWrite' },
        approveAction: 'approve',
        rejectAction: 'reject',
      },
    ],
  },
};

it('renders declared state writers, feedback readers and actions', async () => {
  const registry = success(createStateRegistry(state));
  const approve = vi.fn();
  const reject = vi.fn();
  const user = userEvent.setup();
  render(
    <GenerativeUI
      document={document}
      registry={registry}
      actions={{ approve, reject }}
    />,
  );
  await user.type(screen.getByRole('textbox', { name: 'Summary editor' }), ' updated');
  expect(success(registry.read('summary')).value).toBe('Example summary updated');
  await user.click(screen.getByRole('button', { name: 'Reasoning summary' }));
  expect(screen.getByRole('region', { name: 'Reasoning summary' })).toHaveTextContent(
    'Example summary updated',
  );
  expect(screen.getByRole('button', { name: 'Read reference' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await user.click(screen.getByRole('button', { name: 'Approve tool request' }));
  expect(approve).toHaveBeenCalledWith({ state: registry });
  expect(reject).not.toHaveBeenCalled();
});

it('rejects unregistered tool actions before exposing controls', () => {
  render(<GenerativeUI document={document} />);
  expect(screen.getByRole('alert')).toHaveTextContent('Action is not registered');
  expect(screen.queryByRole('button')).toBeNull();
});
