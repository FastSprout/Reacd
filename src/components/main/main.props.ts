import type { z } from 'zod';
import type { mainSchema } from '../../schema/main/main.schema.js';

export type MainProps = z.infer<typeof mainSchema>;
