import type { z } from 'zod';
import type { errorSchema } from '../../schema/error/error.schema.js';

export type ErrorProps = z.infer<typeof errorSchema>;
