import {
  GenerativeUI,
  defineGenerativeDeclaration,
} from '@fastsprout/reacd/generative';

const KEYS = {
  rows: 'orders.rows',
  selection: 'orders.selected',
  sorting: 'orders.sort',
  filters: 'orders.filters',
  pagination: 'orders.page',
} as const;
const INITIAL_PAGE = { pageIndex: 0, pageSize: 1 };

export const TABLE_STATE_DOCUMENT = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [
    {
      key: KEYS.rows,
      kind: 'tableRows',
      access: 'read',
      initial: [
        { id: 'alpha', cells: { name: 'Sample alpha', amount: 30 } },
        { id: 'beta', cells: { name: 'Sample beta', amount: 10 } },
      ],
    },
    { key: KEYS.selection, kind: 'selection', access: 'readWrite', initial: [] },
    { key: KEYS.sorting, kind: 'sorting', access: 'readWrite', initial: [] },
    { key: KEYS.filters, kind: 'filters', access: 'readWrite', initial: [] },
    {
      key: KEYS.pagination,
      kind: 'pagination',
      access: 'readWrite',
      initial: INITIAL_PAGE,
    },
  ],
  root: {
    type: 'DataTable',
    caption: 'Sample orders',
    columns: [
      { key: 'name', label: 'Name', kind: 'text' },
      { key: 'amount', label: 'Amount', kind: 'number' },
    ],
    bindings: {
      rows: { state: KEYS.rows, mode: 'read' },
      selection: { state: KEYS.selection, mode: 'readWrite' },
      sorting: { state: KEYS.sorting, mode: 'readWrite' },
      filters: { state: KEYS.filters, mode: 'readWrite' },
      pagination: { state: KEYS.pagination, mode: 'readWrite' },
    },
  },
});

export function GenerativeTableExample() {
  return <GenerativeUI document={TABLE_STATE_DOCUMENT} />;
}
