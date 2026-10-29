import type { z } from 'zod';
import type { separatorSchema } from '../../schema/separator/separator.schema.js';

export type SeparatorProps = z.infer<typeof separatorSchema>;
