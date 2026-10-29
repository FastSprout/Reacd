import type { z } from 'zod';
import type { inputComponentSchema } from '../../schema/input/input.schema.js';

export type InputProps = z.infer<typeof inputComponentSchema>;
