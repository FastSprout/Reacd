import type { z } from 'zod';
import type { progressGroupSchema } from '../../schema/progress-group/index.js';
export type ProgressGroupProps = z.infer<typeof progressGroupSchema>;
