import type { z } from 'zod';
import type {
  tableDeclarationSchema,
  staticTableSchema,
} from '../../schema/table/table.schema.js';
import type { interactiveTableSchema } from '../../schema/table/interactive.schema.js';

export type TableProps = z.infer<typeof tableDeclarationSchema>;
export type StaticTableProps = z.infer<typeof staticTableSchema>;
export type InteractiveTableProps = z.infer<typeof interactiveTableSchema>;
