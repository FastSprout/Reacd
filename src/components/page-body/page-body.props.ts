import type { z } from 'zod';
import type { pageBodySchema } from '../../schema/page-body/page-body.schema.js';

export type PageBodyProps = z.infer<typeof pageBodySchema>;
