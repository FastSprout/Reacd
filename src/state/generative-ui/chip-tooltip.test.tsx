import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';
import { GenerativeChip } from './generative-chip.js';
import { BoundTooltip } from './bound-tooltip.js';

const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [
    { key: 'count', kind: 'number', initial: 5, access: 'read' },
    { key: 'visible', kind: 'boolean', initial: true, access: 'readWrite' },
    { key: 'hint', kind: 'boolean', initial: false, access: 'readWrite' },
  ],
  root: {
    type: 'VStack',
    children: [
      {
        type: 'Chip',
        label: 'Unread',
        text: { state: 'count', mode: 'read' },
        show: { state: 'visible', mode: 'read' },
        children: [{ type: 'Text', content: 'Identity' }],
      },
      {
        type: 'Checkbox',
        label: 'Show count',
        checked: { state: 'visible', mode: 'readWrite' },
      },
      {
        type: 'Tooltip',
        text: 'Shared hint',
        open: { state: 'hint', mode: 'readWrite' },
        children: [{ type: 'Text', content: 'Hint anchor' }],
      },
      {
        type: 'Toggle',
        label: 'Open hint',
        checked: { state: 'hint', mode: 'readWrite' },
      },
    ],
  },
});
describe('generative Chip and Tooltip', () => {
  it('shares displays, host updates, and controlled visibility', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(document);
    render(<GenerativeUI document={document} registry={registry} />);
    expect(screen.getByRole('img', { name: 'Unread: 5' })).toBeInTheDocument();
    act(() => {
      expect(registry.update('count', 8).success).toBe(true);
    });
    expect(screen.getByRole('img', { name: 'Unread: 8' })).toBeInTheDocument();
    act(() => {
      expect(registry.update('count', Number.MAX_VALUE).success).toBe(false);
    });
    expect(screen.getByRole('img', { name: 'Unread: 8' })).toBeInTheDocument();
    await user.click(screen.getByLabelText('Show count'));
    expect(screen.queryByRole('img')).toBeNull();
    await user.click(screen.getByRole('switch', { name: 'Open hint' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Shared hint');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    expect(registry.read('hint')).toEqual({
      success: true,
      data: { key: 'hint', kind: 'boolean', value: false },
    });
  });
  it('supports automatic hints and literal/dot/standalone chips', async () => {
    render(
      <GenerativeUI
        document={{
          schemaVersion: '0.2',
          state: [],
          root: {
            type: 'Tooltip',
            text: 'Automatic',
            children: [
              { type: 'Chip', label: 'Online', children: [] },
              {
                type: 'Chip',
                label: 'Zero',
                standalone: true,
                text: 0,
                show: true,
                children: [],
              },
            ],
          },
        }}
      />,
    );
    expect(screen.getByRole('img', { name: 'Online' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Zero: 0' })).toHaveTextContent('0');
  });
  it('rejects unknown references, wrong kinds, writes, and discarded children', () => {
    for (const root of [
      {
        type: 'Tooltip',
        text: 'Hint',
        open: { state: 'count', mode: 'readWrite' },
        children: [{ type: 'Text', content: 'Anchor' }],
      },
      { type: 'Tooltip', text: 'Hint', children: [] },
      {
        type: 'Chip',
        label: 'Count',
        text: { state: 'count', mode: 'readWrite' },
        children: [],
      },
      {
        type: 'Chip',
        label: 'Count',
        show: { state: 'missing', mode: 'read' },
        children: [],
      },
      {
        type: 'Chip',
        label: 'Count',
        standalone: true,
        children: [{ type: 'Text', content: 'Discarded' }],
      },
    ])
      expect(validateGenerativeDocument({ ...document, root }).success).toBe(false);
  });
  it('fails closed for missing live bindings before exposing content', () => {
    const empty = createDocumentState(
      defineGenerativeDeclaration({
        schemaVersion: '0.2',
        state: [],
        root: { type: 'Text', content: 'Empty' },
      }),
    );
    const view = render(
      <GenerativeChip
        registry={empty}
        node={{
          type: 'Chip',
          label: 'Missing',
          children: [],
          text: { state: 'missing', mode: 'read' },
        }}
      >
        Safe
      </GenerativeChip>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
    view.rerender(
      <BoundTooltip
        registry={empty}
        reference={{ state: 'missing', mode: 'readWrite' }}
        node={{ type: 'Tooltip', text: 'Missing', children: [] }}
      >
        Safe
      </BoundTooltip>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  });
});
