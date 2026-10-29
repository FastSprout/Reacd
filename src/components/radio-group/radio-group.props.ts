import type { z } from 'zod';
import type { radioGroupSchema } from '../../schema/radio-group/radio-group.schema.js';
export type RadioGroupProps = z.infer<typeof radioGroupSchema>;
