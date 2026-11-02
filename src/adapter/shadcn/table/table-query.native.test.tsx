import { render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import type { DataTableModel } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/model.schema.js';
import { ShadcnTable } from './table.adapter.js';

const model: DataTableModel = {
  columns: [
    { key: 'name', label: 'Name', kind: 'text' },
    { key: 'amount', label: 'Amount', kind: 'number' },
  ],
  rows: [
    { id: 'empty', cells: { name: 'Empty', amount: null } },
    { id: 'zero', cells: { name: 'Zero', amount: 0 } },
    { id: 'negative', cells: { name: 'Negative', amount: -5 } },
    { id: 'positive', cells: { name: 'Positive', amount: 10 } },
  ],
  selection: [],
  filters: [],
  sorting: [{ column: 'amount', direction: 'ascending' }],
  pagination: { pageIndex: 0, pageSize: 10 },
};
const names = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[1]?.textContent);

it('applies protected SDK row models with nulls last in either direction', () => {
  const view = render(<ShadcnTable mode="interactive" caption="Query" model={model} />);
  expect(names()).toEqual(['Negative', 'Zero', 'Positive', 'Empty']);
  view.rerender(
    <ShadcnTable
      mode="interactive"
      caption="Query"
      model={{ ...model, sorting: [{ column: 'amount', direction: 'descending' }] }}
    />,
  );
  expect(names()).toEqual(['Positive', 'Zero', 'Negative', 'Empty']);
});

it('uses native comparators for null and numeric filters', () => {
  const view = render(
    <ShadcnTable
      mode="interactive"
      caption="Query"
      model={{
        ...model,
        filters: [{ column: 'amount', operator: 'equals', value: null }],
      }}
    />,
  );
  expect(screen.getByRole('cell', { name: 'Empty' })).toBeVisible();
  expect(screen.queryByRole('cell', { name: 'Zero' })).toBeNull();
  view.rerender(
    <ShadcnTable
      mode="interactive"
      caption="Query"
      model={{
        ...model,
        filters: [{ column: 'amount', operator: 'greaterThan', value: -1 }],
      }}
    />,
  );
  expect(names()).toEqual(['Zero', 'Positive']);
  view.rerender(
    <ShadcnTable
      mode="interactive"
      caption="Query"
      model={{
        ...model,
        filters: [{ column: 'amount', operator: 'lessThan', value: 1 }],
      }}
    />,
  );
  expect(names()).toEqual(['Negative', 'Zero']);
});
