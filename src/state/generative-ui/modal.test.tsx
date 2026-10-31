import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { BoundModal } from './bound-modal.js';
import { createDocumentState } from './create-document-state.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'visible', kind: 'boolean', initial: false, access: 'readWrite' }],
  root: {
    type: 'Modal',
    title: 'Generated dialog',
    description: 'Example',
    open: { state: 'visible', mode: 'readWrite' },
    triggerLabel: 'Open generated',
    children: [{ type: 'Text', content: 'Generated body' }],
    footer: [{ type: 'Button', label: 'Apply generated', action: 'apply' }],
  },
});
describe('generative Modal', () => {
  it('uses shared boolean state and validates closed footer actions', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(document);
    const apply = vi.fn();
    const { rerender } = render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={document}
        registry={registry}
        actions={{ apply }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Open generated' }));
    expect(success(registry.read('visible')).value).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Apply generated' }));
    expect(apply).toHaveBeenCalledOnce();
    act(() => {
      registry.update('visible', false);
    });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    rerender(
      <GenerativeUI adapter={shadcnAdapter} document={document} registry={registry} />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  });
  it('rejects incompatible state and safely handles missing live bindings', () => {
    expect(
      validateGenerativeDocument({
        ...document,
        state: [{ key: 'visible', kind: 'text', initial: '', access: 'readWrite' }],
      }).success,
    ).toBe(false);
    if (document.root.type !== 'Modal') throw new Error('Expected Modal');
    render(
      <BoundModal
        node={document.root}
        footer={null}
        registry={success(createStateRegistry([]))}
      >
        {null}
      </BoundModal>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  });
  it('supports declarations without footer content', async () => {
    const user = userEvent.setup();
    if (document.root.type !== 'Modal') throw new Error('Expected Modal');
    const { footer: _footer, ...root } = document.root;
    render(<GenerativeUI adapter={shadcnAdapter} document={{ ...document, root }} />);
    await user.click(screen.getByRole('button', { name: 'Open generated' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
