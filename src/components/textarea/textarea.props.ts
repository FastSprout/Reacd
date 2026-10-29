import type { z } from 'zod';
import type { textareaSchema } from '../../schema/textarea/index.js';

export type TextareaProps = z.infer<typeof textareaSchema>;
