import { CardContent } from '../vendor/ui/card.js';
import { NativeFilter } from './native-filter.js';
import type { NativeTable } from './sdk-table.js';

interface Properties {
  readonly table: NativeTable;
  readonly disabled: boolean;
}
export function NativeFilters({ table, disabled }: Properties) {
  return (
    <CardContent
      className="flex min-w-0 flex-wrap p-0"
      style={{ gap: 'var(--space-medium)' }}
    >
      {table.getAllLeafColumns().map((column) => (
        <NativeFilter key={column.id} column={column} disabled={disabled} />
      ))}
    </CardContent>
  );
}
