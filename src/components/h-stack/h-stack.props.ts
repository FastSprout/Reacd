import type { z } from 'zod';
import type { hStackSchema } from '../../schema/h-stack/h-stack.schema.js';

export type HStackProps = z.infer<typeof hStackSchema>;
