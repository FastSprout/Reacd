import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { GenerativeUI, defineGenerativeDeclaration } from '../../../generative.js';
import { createDocumentState } from
  '../../../state/generative-ui/create-document-state.js';

it.each([shadcnAdapter, muiAdapter])(
  'binds feedback state and actions with native $id components',
  async (adapter) => {
    const declaration = defineGenerativeDeclaration({
      schemaVersion: '0.2',
      state: [
        { key: 'count', kind: 'number', initial: 2, access: 'read' },
        { key: 'visible', kind: 'boolean', initial: true, access: 'readWrite' },
        { key: 'event', kind: 'text', initial: 'plan', access: 'readWrite' },
      ],
      root: {
        type: 'VStack',
        children: [
          { type: 'User', name: 'Ada', action: 'open' },
          {
            type: 'Chip',
            label: 'Messages',
            text: { state: 'count', mode: 'read' },
            show: { state: 'visible', mode: 'read' },
            children: [],
          },
          {
            type: 'Timeline',
            label: 'Delivery',
            items: [
              { id: 'plan', title: 'Plan' },
              { id: 'ship', title: 'Ship' },
            ],
            value: { state: 'event', mode: 'readWrite' },
          },
          {
            type: 'ProgressGroup',
            label: 'Storage',
            items: [{ id: 'apps', label: 'Applications', value: 25 }],
          },
        ],
      },
    });
    const registry = createDocumentState(declaration);
    const open = vi.fn();
    render(
      <GenerativeUI
        adapter={adapter}
        document={declaration}
        registry={registry}
        actions={{ open }}
      />,
    );
    expect(screen.getByRole('img', { name: 'Messages: 2' })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Ada' }));
    expect(open).toHaveBeenCalledWith({ state: registry });
    await userEvent.click(screen.getByRole('button', { name: 'Ship' }));
    expect(screen.getByRole('button', { name: 'Ship' })).toHaveAttribute(
      'aria-current',
      'step',
    );
    expect(registry.update('event', 'absent').success).toBe(false);
    act(() => {
      expect(registry.update('visible', false).success).toBe(true);
    });
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByRole('progressbar', { name: 'Storage' })).toHaveAttribute(
      'aria-valuenow',
      '25',
    );
  },
);
