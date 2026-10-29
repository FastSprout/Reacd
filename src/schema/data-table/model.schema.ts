import { z } from 'zod';
import { dataTableColumnsSchema } from './columns.schema.js';
import { tableRowsValueSchema } from '../state/table-rows/table-rows.schema.js';
import { selectionValueSchema } from '../state/selection/selection.schema.js';
import { sortingValueSchema } from '../state/sorting/sorting.schema.js';
import { filtersValueSchema } from '../state/filters/filters.schema.js';
import { paginationValueSchema } from '../state/pagination/pagination.schema.js';

export const dataTableModelSchema = z.strictObject({
  columns: dataTableColumnsSchema,
  rows: tableRowsValueSchema,
  selection: selectionValueSchema,
  sorting: sortingValueSchema,
  filters: filtersValueSchema,
  pagination: paginationValueSchema,
});
export type DataTableModel = z.infer<typeof dataTableModelSchema>;
export type TableRow = DataTableModel['rows'][number];
export type TableCell = TableRow['cells'][string];
