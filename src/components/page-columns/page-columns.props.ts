import type { z } from 'zod';
import type {
  pageColumnsSchema,
} from '../../schema/page-columns/page-columns.schema.js';

export type PageColumnsProps = z.infer<typeof pageColumnsSchema>;
