import { atom, useAtom } from 'jotai';
import { DataTable, Text, VStack } from '@fastsprout/reacd';
import type { DataTableProps } from '@fastsprout/reacd';

const selectedAtom = atom<DataTableProps['selection']>([]);
const COLUMNS: DataTableProps['columns'] = [
  { key: 'name', label: 'Name', kind: 'text' },
];
const ROWS = [
  { id: 'sample-a', cells: { name: 'First sample' } },
  { id: 'sample-b', cells: { name: 'Second sample' } },
];

export function DataTableExample() {
  const [selection, setSelection] = useAtom(selectedAtom);
  return (
    <VStack>
      <DataTable
        caption="Selectable sample records"
        columns={COLUMNS}
        rows={ROWS}
        selection={selection}
        sorting={[]}
        filters={[]}
        pagination={{ pageIndex: 0, pageSize: 10 }}
        totalRows={ROWS.length}
        filteredRows={ROWS.length}
        pageCount={1}
        onSelectionChange={setSelection}
      />
      <Text>{`Selected sample rows: ${selection.join(', ') || 'none'}`}</Text>
    </VStack>
  );
}
