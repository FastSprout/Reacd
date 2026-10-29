import type { z } from 'zod';
import type { pageSchema } from '../../schema/page/page.schema.js';

export type PageProps = z.infer<typeof pageSchema>;
