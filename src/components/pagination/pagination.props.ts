import type { z } from 'zod';
import type { paginationSchema } from '../../schema/pagination/pagination.schema.js';
export type PaginationProps = z.infer<typeof paginationSchema>;
