import type { z } from 'zod';
import type { contentSearchSchema } from '../../schema/content-search/index.js';

export type ContentSearchProps = z.infer<typeof contentSearchSchema>;
