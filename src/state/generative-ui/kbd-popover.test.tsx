import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { createDocumentState } from './create-document-state.js';
import { GenerativeUI } from './generative-ui.js';
import { BoundKbd } from './bound-kbd.js';
import { BoundPopover } from './bound-popover.js';

const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [
    { key: 'panel', kind: 'boolean', initial: false, access: 'readWrite' },
    { key: 'key', kind: 'text', initial: 'meta', access: 'read' },
    { key: 'draft', kind: 'text', initial: '', access: 'readWrite' },
  ],
  root: {
    type: 'VStack',
    children: [
      { type: 'Kbd', value: { state: 'key', mode: 'read' }, platform: 'apple' },
      {
        type: 'Popover',
        title: 'Generated panel',
        triggerLabel: 'Open generated panel',
        open: { state: 'panel', mode: 'readWrite' },
        children: [
          {
            type: 'Input',
            label: 'Generated draft',
            value: { state: 'draft', mode: 'readWrite' },
          },
          { type: 'Kbd', value: 'enter' },
        ],
        footer: [{ type: 'Button', label: 'Save generated draft', action: 'save' }],
      },
    ],
  },
});
describe('generative Kbd and Popover', () => {
  it('shares displays, open state, fields, and footer actions', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(declaration);
    const save = vi.fn();
    render(
      <GenerativeUI document={declaration} registry={registry} actions={{ save }} />,
    );
    expect(screen.getByRole('img', { name: 'Command' })).toHaveTextContent('⌘');
    act(() => {
      expect(registry.update('key', 'shift').success).toBe(true);
    });
    expect(screen.getByRole('img', { name: 'Shift' })).toHaveTextContent('⇧');
    act(() => {
      expect(registry.update('key', '').success).toBe(false);
    });
    await user.click(screen.getByRole('button', { name: 'Open generated panel' }));
    await user.type(await screen.findByLabelText('Generated draft'), 'Local draft');
    expect(screen.getByRole('img', { name: 'Enter' })).toHaveTextContent('↵');
    await user.click(screen.getByRole('button', { name: 'Save generated draft' }));
    expect(save).toHaveBeenCalledOnce();
    expect(registry.read('draft')).toEqual({
      success: true,
      data: { key: 'draft', kind: 'text', value: 'Local draft' },
    });
    await user.click(screen.getByRole('button', { name: 'Close popover' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(registry.read('panel')).toEqual({
      success: true,
      data: { key: 'panel', kind: 'boolean', value: false },
    });
  });
  it('rejects invalid references and validates hidden footer actions', () => {
    for (const root of [
      { type: 'Kbd', value: { state: 'key', mode: 'readWrite' } },
      { type: 'Kbd', value: { state: 'panel', mode: 'read' } },
      {
        type: 'Popover',
        title: 'Invalid',
        triggerLabel: 'Open invalid',
        open: { state: 'key', mode: 'readWrite' },
        children: [],
      },
    ])
      expect(validateGenerativeDocument({ ...declaration, root }).success).toBe(false);
    render(<GenerativeUI document={declaration} />);
    expect(screen.getByRole('alert')).toHaveTextContent('save');
  });
  it('fails closed for missing live state and supports omitted footers', () => {
    const empty = createDocumentState(
      defineGenerativeDeclaration({
        schemaVersion: '0.2',
        state: [],
        root: { type: 'Text', content: 'Empty' },
      }),
    );
    const view = render(
      <BoundKbd
        registry={empty}
        properties={{}}
        reference={{ state: 'missing', mode: 'read' }}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
    view.rerender(
      <BoundPopover
        registry={empty}
        footer={undefined}
        node={{
          type: 'Popover',
          title: 'Missing',
          triggerLabel: 'Missing',
          children: [],
          open: { state: 'missing', mode: 'readWrite' },
        }}
      >
        Body
      </BoundPopover>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
    view.rerender(
      <GenerativeUI
        document={{
          schemaVersion: '0.2',
          state: [
            { key: 'open', kind: 'boolean', initial: false, access: 'readWrite' },
          ],
          root: {
            type: 'Popover',
            title: 'No footer',
            triggerLabel: 'No footer trigger',
            open: { state: 'open', mode: 'readWrite' },
            children: [],
          },
        }}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'No footer trigger' }),
    ).toBeInTheDocument();
  });
});
