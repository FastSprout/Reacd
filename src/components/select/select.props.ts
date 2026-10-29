import type { z } from 'zod';
import type { selectSchema } from '../../schema/select/select.schema.js';

export type SelectProps = z.infer<typeof selectSchema>;
