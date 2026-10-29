import type { z } from 'zod';
import type { inputNumberSchema } from '../../schema/input-number/index.js';

export type InputNumberProps = z.infer<typeof inputNumberSchema>;
