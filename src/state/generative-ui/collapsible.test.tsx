import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { BoundCollapsible } from './bound-collapsible.js';
import { createDocumentState } from './create-document-state.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'open', kind: 'boolean', initial: false, access: 'readWrite' }],
  root: {
    type: 'Collapsible',
    label: 'Generated disclosure',
    open: { state: 'open', mode: 'readWrite' },
    retainContent: true,
    children: [{ type: 'Button', label: 'Apply generated', action: 'apply' }],
  },
});
describe('generative Collapsible', () => {
  it('shares boolean state with controls and reacts to host writes', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(document);
    const apply = vi.fn();
    render(
      <GenerativeUI
        registry={registry}
        actions={{ apply }}
        document={{
          ...document,
          root: {
            type: 'VStack',
            children: [
              document.root,
              {
                type: 'Toggle',
                label: 'External open',
                checked: { state: 'open', mode: 'readWrite' },
              },
              { type: 'Text', content: { state: 'open', mode: 'read' } },
            ],
          },
        }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Generated disclosure' }));
    expect(success(registry.read('open')).value).toBe(true);
    expect(screen.getByRole('switch', { name: 'External open' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByText('true')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Apply generated' }));
    expect(apply).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('switch', { name: 'External open' }));
    expect(screen.queryByRole('region', { name: 'Generated disclosure' })).toBeNull();
    act(() => {
      registry.update('open', true);
    });
    expect(screen.getByRole('region', { name: 'Generated disclosure' })).toBeVisible();
  });
  it('validates references, permissions, and nested actions while closed', () => {
    render(<GenerativeUI document={document} />);
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
    for (const state of [
      [{ key: 'open', kind: 'text', initial: '', access: 'readWrite' }],
      [{ key: 'open', kind: 'boolean', initial: false, access: 'read' }],
      [],
    ]) {
      expect(validateGenerativeDocument({ ...document, state }).success).toBe(false);
    }
    if (document.root.type !== 'Collapsible') throw new Error('Expected Collapsible');
    expect(
      validateGenerativeDocument({
        ...document,
        root: {
          ...document.root,
          open: { state: 'open', mode: 'read' },
        },
      }).success,
    ).toBe(false);
  });
  it('reports a missing live binding without rendering an interactive panel', () => {
    if (document.root.type !== 'Collapsible') throw new Error('Expected Collapsible');
    render(
      <BoundCollapsible
        node={document.root}
        registry={success(createStateRegistry([]))}
      >
        {null}
      </BoundCollapsible>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
    expect(screen.queryByRole('button')).toBeNull();
  });
});
