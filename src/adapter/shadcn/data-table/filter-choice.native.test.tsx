import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import type { DataTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/data-table/data-table.props.js';
import { ShadcnDataTable } from './data-table.adapter.js';

it('keeps native boolean choices and canonical filter values intact', async () => {
  const change = vi.fn();
  function Example() {
    const [filters, setFilters] = useState<DataTableProps['filters']>([]);
    return (
      <ShadcnDataTable
        caption="Availability"
        columns={[{ key: 'active', label: 'Active', kind: 'boolean' }]}
        rows={[]}
        selection={[]}
        sorting={[]}
        filters={filters}
        pagination={{ pageIndex: 0, pageSize: 1 }}
        totalRows={0}
        filteredRows={0}
        pageCount={0}
        onFiltersChange={(next) => { change(next); setFilters(next); }}
      />
    );
  }
  render(<Example />);
  const choice = screen.getByRole('combobox', { name: 'Filter Active' });
  await userEvent.click(choice);
  await userEvent.keyboard('{End}{Enter}');
  expect(change).toHaveBeenLastCalledWith([
    { column: 'active', operator: 'equals', value: false },
  ]);
  expect(choice).toHaveTextContent('False');
  await userEvent.click(choice);
  await userEvent.click(screen.getByRole('option', { name: 'All' }));
  expect(change).toHaveBeenLastCalledWith([]);
  expect(choice).toHaveTextContent('All');
  expect(choice).toHaveFocus();
});
