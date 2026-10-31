import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { BoundAccordion } from './bound-accordion.js';
import { success } from '../../../test-support/data-table.js';

const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'expanded', kind: 'selection', initial: [], access: 'readWrite' }],
  root: {
    type: 'Accordion',
    label: 'Generated sections',
    value: { state: 'expanded', mode: 'readWrite' },
    items: [
      {
        value: 'one',
        label: 'Generated one',
        content: { type: 'Button', label: 'Nested action', action: 'run' },
      },
      {
        value: 'two',
        label: 'Generated two',
        content: { type: 'Text', content: 'Other panel' },
      },
    ],
  },
});

describe('generative Accordion', () => {
  it('shares state and validates nested actions even while collapsed', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(document);
    const run = vi.fn();
    const { rerender } = render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={document}
        registry={registry}
        actions={{ run }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Generated one' }));
    await user.click(screen.getByRole('button', { name: 'Nested action' }));
    expect(run).toHaveBeenCalledOnce();
    expect(success(registry.read('expanded')).value).toEqual(['one']);
    act(() => {
      registry.update('expanded', ['two']);
    });
    expect(screen.getByText('Other panel')).toBeVisible();
    expect(registry.update('expanded', ['missing']).success).toBe(false);
    rerender(<GenerativeUI adapter={shadcnAdapter} document={document} />);
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  });
  it('rejects wrong initial selections and resolves binding failures safely', () => {
    expect(
      validateGenerativeDocument({
        ...document,
        state: [
          {
            key: 'expanded',
            kind: 'selection',
            initial: ['missing'],
            access: 'readWrite',
          },
        ],
      }).success,
    ).toBe(false);
    if (document.root.type !== 'Accordion') throw new Error('Expected Accordion');
    render(
      <BoundAccordion
        node={document.root}
        registry={success(createStateRegistry([]))}
        items={[]}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  });
});
