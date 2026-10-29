import type { z } from 'zod';
import type { pageListSchema } from '../../schema/page-list/page-list.schema.js';

export type PageListProps = z.infer<typeof pageListSchema>;
