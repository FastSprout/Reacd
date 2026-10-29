import type { z } from 'zod';
import type { dividerSchema } from '../../schema/divider/divider.schema.js';

export type DividerProps = z.infer<typeof dividerSchema>;
