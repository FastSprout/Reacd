import type { z } from 'zod';
import type { emptySchema } from '../../schema/empty/empty.schema.js';
export type EmptyProps = z.infer<typeof emptySchema>;
