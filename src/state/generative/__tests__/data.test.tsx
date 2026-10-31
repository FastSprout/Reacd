import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReacdRenderer } from '../../../index.js';
import type { TableNode } from '../../../index.js';
import { documentWith } from '../../../../test-support/documents.js';

describe('Generative rendering: data', () => {
  it('contains wide data inside a named, focusable table region', () => {
    render(
      <ReacdRenderer
        adapter={shadcnAdapter}
        document={documentWith({
          type: 'Table',
          caption: 'Inventory',
          columns: ['Name', 'State'],
          rows: [
            ['Box', 'Ready'],
            ['Part', 'Held'],
          ],
        })}
        actions={{}}
      />,
    );
    const region = screen.getByRole('region', { name: 'Inventory' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(within(region).getByRole('table', { name: 'Inventory' })).toHaveStyle(
      '--reacd-table-columns: 2',
    );
    expect(within(region).getAllByRole('columnheader')).toHaveLength(2);
    expect(within(region).getAllByRole('cell')).toHaveLength(4);
  });

  const table: TableNode = {
    type: 'Table',
    caption: 'Data',
    columns: ['Value'],
    rows: [],
  };

  it.each([
    { node: table, role: 'status', message: 'No data available.' },
    {
      node: { ...table, emptyMessage: 'Nothing here' },
      role: 'status',
      message: 'Nothing here',
    },
    { node: { ...table, state: 'loading' }, role: 'status', message: 'Loading data…' },
    {
      node: { ...table, state: 'error' },
      role: 'alert',
      message: 'Unable to load data.',
    },
    {
      node: { ...table, state: 'error', errorMessage: 'Try again' },
      role: 'alert',
      message: 'Try again',
    },
  ] satisfies { node: TableNode; role: string; message: string }[])(
    'provides a perceivable data state: $message',
    ({ node, role, message }) => {
      render(
        <ReacdRenderer
          adapter={shadcnAdapter}
          document={documentWith(node)}
          actions={{}}
        />,
      );
      expect(screen.getByRole(role)).toHaveTextContent(message);
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    },
  );
});
