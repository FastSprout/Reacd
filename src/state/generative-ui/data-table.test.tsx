import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { chooseOption } from '../../../test-support/select-choice.js';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  TABLE_MODEL,
  TABLE_BINDINGS,
  tableDefinitions,
  success,
} from '../../../test-support/data-table.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import type { GenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { createDocumentState } from './create-document-state.js';
import { GenerativeUI } from './generative-ui.js';
import { BoundDataTable } from './bound-data-table.js';
import { createStateRegistry } from '../registry/state-registry.js';

const node = {
  type: 'DataTable',
  caption: 'Orders',
  columns: TABLE_MODEL.columns,
  bindings: TABLE_BINDINGS,
} as const;
const declaration: GenerativeDeclaration = {
  schemaVersion: '0.2',
  state: tableDefinitions(),
  root: node,
};

describe('generative DataTable bindings', () => {
  it('validates keys, permissions, and table invariants before rendering', () => {
    expect(validateGenerativeDocument(declaration).success).toBe(true);
    for (const changed of [
      { ...declaration, state: [] },
      {
        ...declaration,
        state: tableDefinitions().map((definition) => ({
          ...definition,
          access: 'read',
        })),
      },
      { ...declaration, root: { ...node, columns: [TABLE_MODEL.columns[0]] } },
      {
        ...declaration,
        root: {
          ...node,
          bindings: {
            ...TABLE_BINDINGS,
            pagination: { state: 'orders.pagination', mode: 'read' },
          },
        },
      },
    ])
      expect(validateGenerativeDocument(changed).success).toBe(false);
  });

  it('connects table interactions to independent named state keys', async () => {
    const user = userEvent.setup();
    const document = success(validateGenerativeDocument(declaration));
    const registry = createDocumentState(document);
    render(
      <GenerativeUI adapter={shadcnAdapter} document={document} registry={registry} />,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Select row a' }));
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('checkbox', { name: 'Select row b' })).toBeInTheDocument();
    expect(success(registry.read('orders.selection')).value).toEqual(['a']);
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(screen.getByRole('checkbox', { name: 'Select row a' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    await user.click(screen.getByRole('button', { name: 'Sort Amount' }));
    expect(success(registry.read('orders.pagination')).value).toEqual({
      pageIndex: 0,
      pageSize: 1,
    });
    expect(screen.getByRole('columnheader', { name: /Sort Amount/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await user.click(screen.getByRole('button', { name: 'Sort Amount' }));
    expect(screen.getByRole('checkbox', { name: 'Select row a' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await user.click(screen.getByRole('button', { name: 'Sort Amount' }));
    fireEvent.change(screen.getByLabelText('Filter Name'), {
      target: { value: 'all' },
    });
    expect(success(registry.read('orders.filters')).value).toEqual([
      { column: 'name', operator: 'contains', value: 'all' },
    ]);
    expect(screen.getByText('No matching rows.')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Filter Name'), {
      target: { value: 'GAM' },
    });
    expect(within(screen.getByRole('table')).getByText('Gamma')).toBeInTheDocument();
    expect(success(registry.read('orders.filters')).value).toEqual([
      { column: 'name', operator: 'contains', value: 'GAM' },
    ]);
    fireEvent.change(screen.getByLabelText('Filter Name'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Filter Amount'), {
      target: { value: '10' },
    });
    expect(screen.getByRole('checkbox', { name: 'Select row b' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Filter Amount'), { target: { value: '' } });
    await chooseOption(user, 'Filter Active', 'False');
    expect(screen.getByRole('checkbox', { name: 'Select row b' })).toBeInTheDocument();
    await chooseOption(user, 'Filter Active', 'All');
    await chooseOption(user, 'Rows per page', '10');
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    await user.click(screen.getByRole('checkbox', { name: 'Select row a' }));
    expect(success(registry.read('orders.selection')).value).toEqual([]);
    act(() => {
      expect(registry.update('orders.rows', []).success).toBe(true);
    });
    expect(screen.getByText('No matching rows.')).toBeInTheDocument();
  });

  it('disables read-only controls and displays loading and errors', () => {
    const readNode = {
      ...node,
      bindings: {
        rows: TABLE_BINDINGS.rows,
        selection: { ...TABLE_BINDINGS.selection, mode: 'read' },
        sorting: { ...TABLE_BINDINGS.sorting, mode: 'read' },
        filters: { ...TABLE_BINDINGS.filters, mode: 'read' },
        pagination: { ...TABLE_BINDINGS.pagination, mode: 'read' },
      },
    } as const;
    const { rerender } = render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={{ ...declaration, root: readNode }}
      />,
    );
    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Sort Name' })).toBeDisabled();
    expect(screen.getByLabelText('Filter Name')).toBeDisabled();
    rerender(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={{ ...declaration, root: { ...readNode, state: 'loading' } }}
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading data');
    rerender(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={{ ...declaration, root: { ...readNode, state: 'error' } }}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Unable to load data.');
    rerender(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={{
          ...declaration,
          root: { ...readNode, state: 'error', errorMessage: 'Service offline' },
        }}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Service offline');
  });

  it('fails closed when an explicit registry lacks the referenced state', () => {
    const registry = success(createStateRegistry([]));
    render(<BoundDataTable node={node} registry={registry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  });

  it('supports a custom empty message for an empty dataset', () => {
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={{
          ...declaration,
          state: tableDefinitions({ ...TABLE_MODEL, rows: [] }),
          root: { ...node, emptyMessage: 'No orders found.' },
        }}
      />,
    );
    expect(screen.getByText('No orders found.')).toBeInTheDocument();
  });

  it('renders null cells without exposing an undefined value', () => {
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={{
          ...declaration,
          state: tableDefinitions({
            ...TABLE_MODEL,
            rows: [
              {
                id: 'empty',
                cells: {
                  name: null,
                  amount: null,
                  active: null,
                },
              },
            ],
          }),
        }}
      />,
    );
    expect(
      screen.getByRole('checkbox', { name: 'Select row empty' }),
    ).toBeInTheDocument();
    expect(within(screen.getByRole('table')).queryByText('null')).toBeNull();
  });

  it('reports rejected UI transitions and keeps the last valid table state', () => {
    const document = success(validateGenerativeDocument(declaration));
    const registry = createDocumentState(document);
    success(
      registry.constrain(['orders.filters'], (read) => {
        const filters = success(read('orders.filters'));
        return filters.kind === 'filters' && filters.value.length === 0
          ? { success: true, data: undefined }
          : {
              success: false,
              issues: [{ path: 'filters', message: 'Filters locked.' }],
            };
      }),
    );
    render(
      <GenerativeUI adapter={shadcnAdapter} document={document} registry={registry} />,
    );
    fireEvent.change(screen.getByLabelText('Filter Name'), { target: { value: 'A' } });
    expect(screen.getByRole('alert')).toHaveTextContent('Filters locked.');
    expect(success(registry.read('orders.filters')).value).toEqual([]);
  });

  it('detects invalid state introduced before the constraint subscription', () => {
    const document = success(validateGenerativeDocument(declaration));
    const registry = createDocumentState(document);
    const concurrent = {
      ...registry,
      constrain: (...args: Parameters<typeof registry.constrain>) => {
        success(registry.update('orders.selection', ['missing']));
        return registry.constrain(...args);
      },
    };
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={document}
        registry={concurrent}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Table state violates');
  });
});
