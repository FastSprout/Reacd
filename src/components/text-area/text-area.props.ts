import type { z } from 'zod';
import type { textAreaSchema } from '../../schema/text-area/text-area.schema.js';

export type TextAreaProps = z.infer<typeof textAreaSchema>;
