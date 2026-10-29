import type { z } from 'zod';
import type { textComponentSchema } from '../../schema/text/text.schema.js';

export type TextProps = z.infer<typeof textComponentSchema>;
