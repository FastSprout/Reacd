import type { z } from 'zod';
import type { pageGridSchema } from '../../schema/page-grid/page-grid.schema.js';

export type PageGridProps = z.infer<typeof pageGridSchema>;
