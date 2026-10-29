import { CONTENT_POLICY } from './policy.js';

export const STATE_KINDS = [
  'richDocument',
  'numberRange',
  'fileList',
  'panelLayout',
  'text',
  'number',
  'nullableNumber',
  'boolean',
  'tableRows',
  'selection',
  'sorting',
  'filters',
  'pagination',
  'date',
  'time',
  'dateRange',
  'timeRange',
] as const;
export const STATE_ACCESS = ['read', 'readWrite'] as const;
export const SORT_DIRECTIONS = ['ascending', 'descending'] as const;
export const FILTER_OPERATORS = [
  'equals',
  'contains',
  'greaterThan',
  'lessThan',
] as const;

export const STATE_POLICY = {
  maxDefinitions: 256,
  maxKeyLength: CONTENT_POLICY.maxIdentifierLength,
  maxRows: CONTENT_POLICY.maxTableRows,
  maxColumns: CONTENT_POLICY.maxTableColumns,
  maxSelection: CONTENT_POLICY.maxTableRows,
  maxSorting: CONTENT_POLICY.maxTableColumns,
  maxFilters: CONTENT_POLICY.maxTableColumns,
  maxPageSize: 100,
  defaultPageSize: 25,
} as const;

export type StateKind = (typeof STATE_KINDS)[number];
export type StateAccess = (typeof STATE_ACCESS)[number];

export const GENERATIVE_POLICY = {
  version: '0.2',
  schemaId: 'https://reacd.dev/schema/0.2.json',
} as const;
