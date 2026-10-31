import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { ChatFeedbackNodeView } from './chat-feedback-node-view.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const definitions = [
  { key: 'expanded', kind: 'boolean', initial: false, access: 'readWrite' },
  { key: 'summary', kind: 'text', initial: 'Example summary', access: 'readWrite' },
  { key: 'working', kind: 'boolean', initial: true, access: 'readWrite' },
];

it('binds disclosure and readonly summary projections in isolated stores', async () => {
  const registry = success(createStateRegistry(definitions));
  const other = success(createStateRegistry(definitions));
  const user = userEvent.setup();
  const node = {
    type: 'ChatReasoning',
    text: { state: 'summary', mode: 'read' },
    open: { state: 'expanded', mode: 'readWrite' },
  } as const;
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChatFeedbackNodeView node={node} registry={registry} actions={{}} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Reasoning summary' }));
  expect(success(registry.read('expanded')).value).toBe(true);
  expect(success(other.read('expanded')).value).toBe(false);
  expect(screen.getByRole('region', { name: 'Reasoning summary' })).toHaveTextContent(
    'Example summary',
  );
  act(() => {
    registry.update('summary', 'Updated summary');
  });
  expect(screen.getByRole('region', { name: 'Reasoning summary' })).toHaveTextContent(
    'Updated summary',
  );
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChatFeedbackNodeView
        node={{
          ...node,
          open: { state: 'expanded', mode: 'read' },
          streaming: true,
          autoOpen: true,
          autoClose: true,
        }}
        registry={registry}
        actions={{}}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('button', { name: 'Reasoning summary' })).toBeDisabled();
  expect(success(registry.read('expanded')).value).toBe(true);
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChatFeedbackNodeView
        node={{ ...node, text: 'Literal summary', disabled: true }}
        registry={registry}
        actions={{}}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('region', { name: 'Reasoning summary' })).toHaveTextContent(
    'Literal summary',
  );
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

it('reads shimmer text and activity and enforces nonempty text constraints', () => {
  const registry = success(createStateRegistry(definitions));
  const node = {
    type: 'ChatShimmer',
    text: { state: 'summary', mode: 'read' },
    active: { state: 'working', mode: 'read' },
  } as const;
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChatFeedbackNodeView node={node} registry={registry} actions={{}} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Example summary');
  act(() => {
    registry.update('working', false);
  });
  expect(screen.queryByRole('status')).toBeNull();
  expect(registry.update('summary', '').success).toBe(false);
  for (const active of [undefined, false, true]) {
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <ChatFeedbackNodeView
          node={{ type: 'ChatShimmer', text: 'Literal progress', active }}
          registry={registry}
          actions={{}}
        />
      </ReacdProvider>,
    );
    expect(screen.getByText('Literal progress')).toHaveAttribute(
      'data-active',
      String(active ?? true),
    );
  }
});
