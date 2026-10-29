import type { z } from 'zod';
import type { inputDateSchema } from '../../schema/input-date/index.js';

export type InputDateProps = z.infer<typeof inputDateSchema>;
