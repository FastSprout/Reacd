import type { z } from 'zod';
import type { inputTagsSchema } from '../../schema/input-tags/index.js';
export type InputTagsProps = z.infer<typeof inputTagsSchema>;
