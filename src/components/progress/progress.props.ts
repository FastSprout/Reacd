import type { z } from 'zod';
import type { progressSchema } from '../../schema/progress/progress.schema.js';

export type ProgressProps = z.infer<typeof progressSchema>;
