import { useId } from 'react';
import { DATA_TABLE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/data-table-policy.js';
import type { DataTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/data-table/data-table.js';
import { Input } from '../vendor/ui/input.js';
import { Label } from '../vendor/ui/label.js';
import { ShadcnSelect } from '../select/select.adapter.js';

type Column = DataTableProps['columns'][number];
export function TableColumnFilter({
  column,
  filters,
  onFiltersChange,
}: {
  column: Column;
  filters: DataTableProps['filters'];
  onFiltersChange: DataTableProps['onFiltersChange'];
}) {
  const id = useId();
  const current = filters.find((filter) => filter.column === column.key);
  function change(input: string) {
    const value =
      column.kind === 'boolean' && input === DATA_TABLE_POLICY.allFilterValue
        ? ''
        : input;
    const remaining = filters.filter((filter) => filter.column !== column.key);
    const scalar =
      column.kind === 'number'
        ? Number(value)
        : column.kind === 'boolean'
          ? value === 'true'
          : value;
    onFiltersChange?.(
      value === ''
        ? remaining
        : [
            ...remaining,
            {
              column: column.key,
              operator: column.kind === 'text' ? 'contains' : 'equals',
              value: scalar,
            },
          ],
    );
  }
  const value = current === undefined ? '' : String(current.value);
  const label = `Filter ${column.label}`;
  if (column.kind === 'boolean')
    return (
      <ShadcnSelect
        label={label}
        value={value === '' ? DATA_TABLE_POLICY.allFilterValue : value}
        items={[
          { value: DATA_TABLE_POLICY.allFilterValue, label: 'All' },
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' },
        ]}
        disabled={onFiltersChange === undefined}
        onValueChange={change}
      />
    );
  return (
    <div className="reacd-field">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        className="reacd-input"
        value={value}
        type={column.kind === 'number' ? 'number' : 'search'}
        disabled={onFiltersChange === undefined}
        onChange={(event) => change(event.currentTarget.value)}
      />
    </div>
  );
}
