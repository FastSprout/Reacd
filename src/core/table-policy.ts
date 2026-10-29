export const TABLE_EDITABLE = {
  selection: true,
  sorting: true,
  filters: true,
  pagination: true,
} as const;
export const TABLE_VIEW_FIELDS = [
  'selection',
  'sorting',
  'filters',
  'pagination',
] as const;
export const TABLE_DEFAULTS = {
  loadingMessage: 'Loading data…',
  emptyMessage: 'No data available.',
  errorMessage: 'Unable to load data.',
  retryLabel: 'Retry table',
} as const;
