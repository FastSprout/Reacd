import type { GenerativeDeclaration, GenerativeNode } from 'reacd/generative';

export const TABLE_STATE: GenerativeDeclaration['state'] = [
  {
    key: 'orders.rows',
    kind: 'tableRows',
    access: 'read',
    initial: [
      { id: 'A', cells: { name: 'Sample alpha', amount: 30, active: true } },
      { id: 'B', cells: { name: 'Sample beta', amount: 10, active: false } },
      { id: 'C', cells: { name: 'Sample gamma', amount: 20, active: true } },
    ],
  },
  { key: 'orders.selected', kind: 'selection', access: 'readWrite', initial: [] },
  { key: 'orders.sort', kind: 'sorting', access: 'readWrite', initial: [] },
  { key: 'orders.filters', kind: 'filters', access: 'readWrite', initial: [] },
  {
    key: 'orders.page',
    kind: 'pagination',
    access: 'readWrite',
    initial: { pageIndex: 0, pageSize: 1 },
  },
];
export const TABLE_NODE: GenerativeNode = {
  type: 'DataTable',
  caption: 'Sample orders',
  columns: [
    { key: 'name', label: 'Name', kind: 'text' },
    { key: 'amount', label: 'Amount', kind: 'number' },
    { key: 'active', label: 'Active', kind: 'boolean' },
  ],
  bindings: {
    rows: { state: 'orders.rows', mode: 'read' },
    selection: { state: 'orders.selected', mode: 'readWrite' },
    sorting: { state: 'orders.sort', mode: 'readWrite' },
    filters: { state: 'orders.filters', mode: 'readWrite' },
    pagination: { state: 'orders.page', mode: 'readWrite' },
  },
};
