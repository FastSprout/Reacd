import { act, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { createDocumentState } from './create-document-state.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import type {
  GenerativeDeclaration,
  GenerativeNode,
} from '../../schema/generative-v2/document.schema.js';
import { ReacdProvider } from '../provider/provider.js';
import { shadcnAdapter } from '../../adapter/shadcn/shadcn.adapter.js';

function declaration(root: GenerativeNode): GenerativeDeclaration {
  return {
    schemaVersion: '0.2',
    state: [
      { key: 'name', kind: 'text', initial: 'Initial', access: 'readWrite' },
      { key: 'enabled', kind: 'boolean', initial: false, access: 'readWrite' },
      { key: 'amount', kind: 'number', initial: 50, access: 'readWrite' },
    ],
    root,
  };
}

const fields: GenerativeNode = {
  type: 'VStack',
  children: [
    {
      type: 'Input',
      label: 'First writer',
      value: { state: 'name', mode: 'readWrite' },
    },
    {
      type: 'Input',
      label: 'Second writer',
      value: { state: 'name', mode: 'readWrite' },
    },
    { type: 'Text', content: { state: 'name', mode: 'read' } },
    {
      type: 'Checkbox',
      label: 'Enabled',
      checked: { state: 'enabled', mode: 'readWrite' },
    },
    {
      type: 'Toggle',
      label: 'Updates',
      checked: { state: 'enabled', mode: 'readWrite' },
    },
    { type: 'Text', content: { state: 'enabled', mode: 'read' } },
    {
      type: 'Slider',
      label: 'Amount',
      min: 0,
      max: 100,
      step: 10,
      value: { state: 'amount', mode: 'readWrite' },
    },
    { type: 'Progress', label: 'Completion', value: { state: 'amount', mode: 'read' } },
  ],
};

function parsed(document: GenerativeDeclaration) {
  const result = validateGenerativeDocument(document);
  if (!result.success) throw new Error(JSON.stringify(result.issues));
  return result.data;
}

describe('reactive generative UI', () => {
  it('connects several writers and displays to the same typed state', async () => {
    const controlWidth = 200;
    const controlHeight = 44;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => new DOMRect(0, 0, controlWidth, controlHeight),
    );
    const user = userEvent.setup();
    render(<GenerativeUI document={declaration(fields)} />);
    await user.clear(screen.getByLabelText('First writer'));
    await user.type(screen.getByLabelText('First writer'), 'Shared');
    expect(screen.getByLabelText('Second writer')).toHaveValue('Shared');
    expect(screen.getByText('Shared')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Second writer'), ' value');
    expect(screen.getByLabelText('First writer')).toHaveValue('Shared value');
    await user.click(screen.getByText('Enabled'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('true')).toBeInTheDocument();
    await user.click(screen.getByText('Updates'));
    expect(screen.getByText('false')).toBeInTheDocument();
    screen.getByRole('slider').focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60');
  });

  it('preserves state across themes and repeated document validation', async () => {
    const user = userEvent.setup();
    const document = declaration(fields);
    const { rerender } = render(
      <ReacdProvider>
        <GenerativeUI document={document} />
      </ReacdProvider>,
    );
    await user.clear(screen.getByLabelText('First writer'));
    await user.type(screen.getByLabelText('First writer'), 'Retained');
    rerender(
      <ReacdProvider templateId="erp-compact">
        <GenerativeUI document={structuredClone(document)} />
      </ReacdProvider>,
    );
    expect(screen.getByLabelText('Second writer')).toHaveValue('Retained');
    expect(screen.getByText('Retained')).toBeInTheDocument();
  });

  it('supports literal layouts, tables, progress, and registered host actions', () => {
    const action = vi.fn<GenerativeActions[string]>();
    const document = declaration({
      type: 'HStack',
      children: [
        { type: 'Card', children: [{ type: 'Text', content: 'Literal' }] },
        {
          type: 'Grid',
          columns: 2,
          children: [
            { type: 'Progress', label: 'Fixed', value: 25 },
            { type: 'Table', caption: 'Example', columns: ['Value'], rows: [['A']] },
            { type: 'Button', label: 'Save', action: 'save' },
          ],
        },
      ],
    });
    const actions: Record<string, GenerativeActions[string]> = { save: action };
    render(
      <GenerativeUI
        document={document}
        actions={actions}
        adapter={shadcnAdapter}
        templateId="erp-compact"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(action).toHaveBeenCalledOnce();
    expect(action.mock.calls.at(0)?.[0].state.keys).toEqual([
      'name',
      'enabled',
      'amount',
    ]);
    delete actions['save'];
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(action).toHaveBeenCalledOnce();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('requires explicit state-shape migration to a new registry', () => {
    const document = declaration({ type: 'Text', content: 'Visible' });
    const { rerender } = render(<GenerativeUI document={document} />);
    const replacement = parsed({ ...document, state: [] });
    rerender(<GenerativeUI document={replacement} />);
    expect(screen.getByRole('alert')).toHaveTextContent('explicitly migrated');
    rerender(
      <GenerativeUI
        document={replacement}
        registry={createDocumentState(replacement)}
      />,
    );
    expect(screen.getByText('Visible')).toBeInTheDocument();
  });

  it('supports SSR and explicit shared state scopes', () => {
    const document = parsed(
      declaration({ type: 'Text', content: { state: 'name', mode: 'read' } }),
    );
    const registry = createDocumentState(document);
    act(() => {
      registry.update('name', 'Server value');
    });
    expect(
      renderToString(<GenerativeUI document={document} registry={registry} />),
    ).toContain('Server value');
  });

  it('rejects invalid declarations and missing or inherited actions', () => {
    const { rerender } = render(<GenerativeUI document={{}} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    for (const action of ['missing', 'toString']) {
      rerender(
        <GenerativeUI
          document={declaration({ type: 'Button', label: 'Run', action })}
        />,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('not registered');
    }
  });
});
