export const COLUMN_KINDS = ['text', 'number', 'boolean'] as const;
export const DATA_TABLE_POLICY = {
  firstPageIndex: 0,
  minimumPageCount: 1,
  pageStep: 1,
  pageSizes: [10, 25, 50, 100],
  allFilterValue: 'all',
} as const;
