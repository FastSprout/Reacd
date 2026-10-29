import type { z } from 'zod';
import type { dataTableComponentSchema } from '../../schema/data-table/index.js';

export type DataTableProps = z.infer<typeof dataTableComponentSchema>;
